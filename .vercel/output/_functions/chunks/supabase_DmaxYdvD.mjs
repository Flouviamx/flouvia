import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://lblmwsjgjawrirzxcqiy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibG13c2pnamF3cmlyenhjcWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MDI4NDgsImV4cCI6MjA5MzA3ODg0OH0.Ek7m-H3JeOClrgnek4h53LXE0icImPmlFb93PPVd2X8";
const supabase = createClient(supabaseUrl, supabaseKey);
export {
  supabase as s
};
