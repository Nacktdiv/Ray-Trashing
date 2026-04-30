"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {Toaster} from 'react-hot-toast'
import { createClient } from "@/app/lib/supabase";
import { usePathname } from "next/navigation";
import LoadingTrash from "../app/components/loadingTrash"; 
import { motion, AnimatePresence } from "framer-motion"; 

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    const syncUser = async (session) => {
      try {
        if (session?.user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          
          if (!error) {
            setProfile(data);
            setUser(session.user);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Sync Error:", err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return;
      
      console.log("Auth Event Handled:", event);
      setLoading(true); 
      syncUser(session);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    console.log('use effect 2')
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      <AnimatePresence mode="popLayout">
        {loading ? (
          <motion.div 
            key="loading" 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
          >
            <LoadingTrash />
          </motion.div>
        ) : (
          <motion.div 
            key="content" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster
        position="top-center"
        reverseOrder={false}
          toastOptions={{
            className: 'shadow-lg rounded-lg font-medium',
            duration: 5000,
            removeDelay: 1000,
            style: {
              background: 'white',
              color: ' rgb(71 85 105)',
            },

            success: {
              duration: 2000,
              iconTheme: {
                primary: 'green',
                secondary: 'white',
              },
            },

            error: {
              duration: 5000,
              iconTheme: {
                primary: 'red',
                secondary:'white',
              },
            },

            loading: {
              iconTheme: {
                primary: 'yellow',
                secondary: 'white'
              }
            }
          }}
        />
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);


