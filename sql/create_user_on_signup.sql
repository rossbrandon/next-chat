-- Inserts metadata from GitHub or Google SSO meta data into public.users table
BEGIN
  INSERT INTO public.users (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->>'user_name',
      NEW.raw_user_meta_data ->>'name'
    ),
    COALESCE(
      NEW.raw_user_meta_data ->>'avatar_url',
      NEW.raw_user_meta_data ->>'picture'
    )
  );
  RETURN NEW;
END;
