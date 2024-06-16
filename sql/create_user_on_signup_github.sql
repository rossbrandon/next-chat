-- Inserts metadata from Github SSO meta data into public.users table
BEGIN
    INSERT INTO public.users (id,display_name,avatar_url)
    VALUES (
      NEW.id,
      new.raw_user_meta_data ->>'user_name',
      new.raw_user_meta_data ->>'avatar_url'
    );
    RETURN NEW;
END;
