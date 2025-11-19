import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  level: number;
  xp: number;
  daysWithoutAI: number;
  activeChallenges: number;
}

export interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
    isExpert?: boolean;
    expertise?: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  likedByUser: boolean;
}

interface DataContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  posts: Post[];
  addPost: (content: string, image?: string) => void;
  toggleLike: (postId: string) => void;
  deletePost: (postId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
  id: "user-1",
  name: "João da Silva",
  username: "joao_silva",
  email: "joao@email.com",
  bio: "Em busca de uma vida mais equilibrada e consciente 🌱",
  level: 7,
  xp: 3250,
  daysWithoutAI: 12,
  activeChallenges: 5,
};

const expertPosts: Post[] = [
  {
    id: "expert-1",
    author: {
      name: "Dra. Ana Costa",
      username: "dra_anacosta",
      isExpert: true,
      expertise: "Psicóloga Digital"
    },
    content: "A desintoxicação digital não é sobre eliminar completamente a tecnologia, mas sobre criar uma relação mais saudável com ela. Comece com pequenos passos: 30 minutos sem telas antes de dormir pode transformar sua qualidade de sono! 💤✨",
    likes: 234,
    comments: 45,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likedByUser: false
  },
  {
    id: "expert-2",
    author: {
      name: "Prof. Carlos Mendes",
      username: "prof_mendes",
      isExpert: true,
      expertise: "Neurocientista"
    },
    content: "Estudos mostram que 20 minutos de leitura por dia podem reduzir o estresse em até 68%. A leitura ativa áreas do cérebro diferentes das que usamos em telas, promovendo um descanso cognitivo real. 📚🧠",
    likes: 189,
    comments: 32,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likedByUser: true
  },
  {
    id: "expert-3",
    author: {
      name: "Maria Oliveira",
      username: "maria_wellness",
      isExpert: true,
      expertise: "Coach de Bem-estar"
    },
    content: "Dica prática: crie 'zonas livres de tecnologia' em casa. A mesa de jantar e o quarto são ótimos lugares para começar. Isso ajuda a reconectar com família e com você mesmo! 🏡💚",
    likes: 312,
    comments: 67,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likedByUser: false
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("reconectar-profile");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem("reconectar-posts");
    const userPosts = saved ? JSON.parse(saved) : [];
    return [...userPosts, ...expertPosts].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  });

  useEffect(() => {
    localStorage.setItem("reconectar-profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    const userPosts = posts.filter(p => !p.author.isExpert);
    localStorage.setItem("reconectar-posts", JSON.stringify(userPosts));
  }, [posts]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addPost = (content: string, image?: string) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: {
        name: profile.name,
        username: profile.username,
        avatar: profile.avatar,
        isExpert: false
      },
      content,
      image,
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
      likedByUser: false
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const toggleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
              likedByUser: !post.likedByUser
            }
          : post
      )
    );
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        updateProfile,
        posts,
        addPost,
        toggleLike,
        deletePost
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}
