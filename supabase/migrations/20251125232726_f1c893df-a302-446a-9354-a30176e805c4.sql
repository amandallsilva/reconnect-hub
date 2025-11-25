-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'specialist', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT NOT NULL,
  avatar TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  digital_detox_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create user_blocks table (for moderation)
CREATE TABLE public.user_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community_posts table
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post_likes table
CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_from_user BOOLEAN DEFAULT true,
  specialist_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user is blocked
CREATE OR REPLACE FUNCTION public.is_user_blocked(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_blocks
    WHERE user_id = _user_id
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Anyone can view roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User blocks policies
CREATE POLICY "Specialists and admins can view blocks"
  ON public.user_blocks FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'specialist') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Specialists and admins can block users"
  ON public.user_blocks FOR INSERT
  TO authenticated
  WITH CHECK (
    (public.has_role(auth.uid(), 'specialist') OR public.has_role(auth.uid(), 'admin'))
    AND NOT public.is_user_blocked(auth.uid())
  );

CREATE POLICY "Only admins can unblock users"
  ON public.user_blocks FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Community posts policies
CREATE POLICY "Anyone can view posts"
  ON public.community_posts FOR SELECT
  TO authenticated
  USING (NOT public.is_user_blocked(author_id));

CREATE POLICY "Non-blocked users can create posts"
  ON public.community_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id AND 
    NOT public.is_user_blocked(auth.uid())
  );

CREATE POLICY "Users can update own posts"
  ON public.community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users and admins can delete posts"
  ON public.community_posts FOR DELETE
  TO authenticated
  USING (
    auth.uid() = author_id OR 
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'specialist')
  );

-- Post likes policies
CREATE POLICY "Anyone can view likes"
  ON public.post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Non-blocked users can like posts"
  ON public.post_likes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND 
    NOT public.is_user_blocked(auth.uid())
  );

CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view own messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    specialist_id = auth.uid() OR
    public.has_role(auth.uid(), 'specialist') OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can send messages"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid() AND is_from_user = true) OR
    (specialist_id = auth.uid() AND is_from_user = false AND (
      public.has_role(auth.uid(), 'specialist') OR 
      public.has_role(auth.uid(), 'admin')
    ))
  );

CREATE POLICY "Specialists can mark messages as read"
  ON public.chat_messages FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'specialist') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.raw_user_meta_data->>'avatar'
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;