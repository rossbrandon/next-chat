create trigger trigger_create_user_on_signup_github after insert on auth.users for each row execute function create_user_on_signup_github();
