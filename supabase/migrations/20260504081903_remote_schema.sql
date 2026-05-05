create extension if not exists "postgis" with schema "extensions";

drop extension if exists "pg_net";

create extension if not exists "pg_trgm" with schema "public";

create type "public"."difficulty of projects" as enum ('mudah', 'sedang', 'sulit');

create type "public"."type of projects" as enum ('Individual', 'Community');

create type "public"."type of roles" as enum ('Leader', 'Member');

create type "public"."type of status" as enum ('Pending', 'Complete', 'Published');


  create table "public"."climate_impact_logs" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid,
    "waste_weight_gram" double precision,
    "co2_saved_kg" double precision,
    "impact_badge" character varying(100)
      );



  create table "public"."products" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid,
    "profiles_id" uuid,
    "price" numeric(12,2),
    "description" text,
    "published_at" timestamp with time zone default now(),
    "whatsapp" bigint
      );



  create table "public"."profiles" (
    "id" uuid not null,
    "rt_id" uuid,
    "name" character varying(255),
    "phone_number" character varying(20),
    "total_individual_points" integer default 0,
    "active_individual_project_count" integer default 0
      );



  create table "public"."project_members" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "user_id" uuid not null,
    "task_description" text,
    "is_completed" boolean default false,
    "chat_history" jsonb,
    "role" public."type of roles" not null default 'Leader'::public."type of roles"
      );



  create table "public"."projects" (
    "id" uuid not null default gen_random_uuid(),
    "title" character varying(255) not null,
    "material_category" character varying(100) not null,
    "final_image_url" text,
    "created_at" timestamp with time zone default now(),
    "join_code" text,
    "difficulty" public."difficulty of projects" not null,
    "type" public."type of projects" not null,
    "points_earned" integer not null,
    "points_applied" boolean default false,
    "ai_validation_status" public."type of status" not null default 'Pending'::public."type of status",
    "carbon_footprint" double precision
      );



  create table "public"."region" (
    "id" character varying not null,
    "created_at" timestamp with time zone not null default now(),
    "nama" character varying not null,
    "parent_id" character varying,
    "level" integer not null,
    "total_accumulated_points" double precision
      );



  create table "public"."rt_rw" (
    "id" uuid not null default gen_random_uuid(),
    "rt_number" character varying(255) not null,
    "rw_number" character varying(50),
    "total_accumulated_points" double precision default 0,
    "region_id" character varying
      );



  create table "public"."wa_order_leads" (
    "id" uuid not null default gen_random_uuid(),
    "product_id" uuid,
    "potential_buyer_id" uuid,
    "click_timestamp" timestamp with time zone default now()
      );


CREATE UNIQUE INDEX climate_impact_logs_pkey ON public.climate_impact_logs USING btree (id);

CREATE UNIQUE INDEX community_group_rt_pkey ON public.rt_rw USING btree (id);

CREATE INDEX idx_region_nama_trgm ON public.region USING gin (nama public.gin_trgm_ops);

CREATE UNIQUE INDEX product_listings_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX product_listings_project_id_key ON public.products USING btree (project_id);

CREATE UNIQUE INDEX products_id_key ON public.products USING btree (id);

CREATE UNIQUE INDEX products_project_id_key ON public.products USING btree (project_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX project_members_pkey ON public.project_members USING btree (id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX region_pkey ON public.region USING btree (id);

CREATE UNIQUE INDEX wa_order_leads_pkey ON public.wa_order_leads USING btree (id);

alter table "public"."climate_impact_logs" add constraint "climate_impact_logs_pkey" PRIMARY KEY using index "climate_impact_logs_pkey";

alter table "public"."products" add constraint "product_listings_pkey" PRIMARY KEY using index "product_listings_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."project_members" add constraint "project_members_pkey" PRIMARY KEY using index "project_members_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."region" add constraint "region_pkey" PRIMARY KEY using index "region_pkey";

alter table "public"."rt_rw" add constraint "community_group_rt_pkey" PRIMARY KEY using index "community_group_rt_pkey";

alter table "public"."wa_order_leads" add constraint "wa_order_leads_pkey" PRIMARY KEY using index "wa_order_leads_pkey";

alter table "public"."climate_impact_logs" add constraint "climate_impact_logs_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."climate_impact_logs" validate constraint "climate_impact_logs_project_id_fkey";

alter table "public"."products" add constraint "product_listings_project_id_key" UNIQUE using index "product_listings_project_id_key";

alter table "public"."products" add constraint "products_id_key" UNIQUE using index "products_id_key";

alter table "public"."products" add constraint "products_profiles_id_fkey" FOREIGN KEY (profiles_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."products" validate constraint "products_profiles_id_fkey";

alter table "public"."products" add constraint "products_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."products" validate constraint "products_project_id_fkey";

alter table "public"."products" add constraint "products_project_id_key" UNIQUE using index "products_project_id_key";

alter table "public"."profiles" add constraint "profiles_active_individual_project_count_check" CHECK ((active_individual_project_count <= 5)) not valid;

alter table "public"."profiles" validate constraint "profiles_active_individual_project_count_check";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_rt_id_fkey" FOREIGN KEY (rt_id) REFERENCES public.rt_rw(id) not valid;

alter table "public"."profiles" validate constraint "profiles_rt_id_fkey";

alter table "public"."project_members" add constraint "project_members_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."project_members" validate constraint "project_members_project_id_fkey";

alter table "public"."project_members" add constraint "project_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."project_members" validate constraint "project_members_user_id_fkey";

alter table "public"."region" add constraint "region_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.region(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."region" validate constraint "region_parent_id_fkey";

alter table "public"."rt_rw" add constraint "rt_rw_region_id_fkey" FOREIGN KEY (region_id) REFERENCES public.region(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."rt_rw" validate constraint "rt_rw_region_id_fkey";

alter table "public"."wa_order_leads" add constraint "wa_order_leads_potential_buyer_id_fkey" FOREIGN KEY (potential_buyer_id) REFERENCES public.profiles(id) not valid;

alter table "public"."wa_order_leads" validate constraint "wa_order_leads_potential_buyer_id_fkey";

alter table "public"."wa_order_leads" add constraint "wa_order_leads_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."wa_order_leads" validate constraint "wa_order_leads_product_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public._add_points_to_rt_rw_and_profile(p_rt_id uuid, p_profile_id uuid, p_points numeric)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Tambah ke RT/RW
  UPDATE public.rt_rw
  SET total_accumulated_points = COALESCE(total_accumulated_points, 0) + p_points
  WHERE id = p_rt_id;

  -- Tambah ke Profile Individu
  UPDATE public.profiles
  SET total_individual_points = COALESCE(total_individual_points, 0) + p_points
  WHERE id = p_profile_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_region_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.parent_id IS NOT NULL AND NEW.level > 1 THEN
        IF NEW.id NOT LIKE NEW.parent_id || '.%' THEN
            NEW.id := NEW.parent_id || '.' || NEW.id;
        END IF;
    END IF;
    RETURN NEW;
END;
$function$
;

create or replace view "public"."get_product_detail" as  SELECT pr.id,
    pr.title,
    pr.material_category,
    pr.ai_validation_status,
    pr.final_image_url,
    pr.created_at,
    prd.price,
    prd.description,
    prd.whatsapp,
    pro.name,
    rt.rt_number,
    rt.rw_number,
    kl.nama AS kelurahan,
    kc.nama AS kecamatan,
    kt.nama AS kota_kab,
    prv.nama AS provinsi
   FROM (((((((public.projects pr
     JOIN public.products prd ON ((pr.id = prd.project_id)))
     JOIN public.profiles pro ON ((prd.profiles_id = pro.id)))
     JOIN public.rt_rw rt ON ((pro.rt_id = rt.id)))
     JOIN public.region kl ON (((rt.region_id)::text = (kl.id)::text)))
     JOIN public.region kc ON (((kl.parent_id)::text = (kc.id)::text)))
     JOIN public.region kt ON (((kc.parent_id)::text = (kt.id)::text)))
     JOIN public.region prv ON (((kt.parent_id)::text = (prv.id)::text)));


CREATE OR REPLACE FUNCTION public.handle_generate_join_code()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  new_generated_code TEXT;
  is_unique BOOLEAN := FALSE;
BEGIN
  -- 1. Semak jika type adalah 'Community'
  IF NEW.type = 'Community' THEN
    
    -- 2. Gelung untuk memastikan kod tidak bertindih (Unique)
    WHILE NOT is_unique LOOP
      -- Menjana kod rawak 6 aksara (Huruf Besar & Nombor)
      new_generated_code := upper(substring(md5(random()::text) from 1 for 6));
      
      -- Semak jika kod sudah wujud dalam jadual projects
      SELECT NOT EXISTS (
        SELECT 1 FROM projects WHERE join_code = new_generated_code
      ) INTO is_unique;
    END LOOP;

    -- 3. Masukkan kod ke dalam baris baru
    NEW.join_code := new_generated_code;
    
  ELSE
    -- Jika type 'Individual' atau lain-lain, set kepada NULL
    NEW.join_code := NULL;
  END IF;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  INSERT INTO public.profiles (id, name, rt_id, phone_number)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'), -- 
    (new.raw_user_meta_data->>'rt_id')::uuid,          -- Perbaikan typo 'uuid'
    COALESCE(new.raw_user_meta_data->>'phone_number', '-')       -- Sesuaikan 'phone' dengan name di form Next.js kamu
  );
  RETURN new;
END;$function$
;

CREATE OR REPLACE FUNCTION public.projects_points_sync()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_points numeric;
  v_project_type text;
  v_member_count integer;
  v_share numeric;
  rec_member RECORD;
  v_profile_id uuid;
  v_rt_id uuid;
BEGIN
  -- Filter: Hanya jalan jika status berubah menjadi 'Complete'
  IF (TG_OP = 'UPDATE') THEN
    IF NOT (NEW.ai_validation_status = 'Complete' AND (OLD.ai_validation_status IS DISTINCT FROM 'Complete')) THEN
      RETURN NEW;
    END IF;
  ELSIF (TG_OP = 'INSERT') THEN
    IF NEW.ai_validation_status IS DISTINCT FROM 'Complete' THEN
      RETURN NEW;
    END IF;
  END IF;

  -- Safeguard: Jangan proses jika sudah pernah diaplikasikan
  IF COALESCE(NEW.points_applied, FALSE) = TRUE THEN
    RETURN NEW;
  END IF;

  v_points := COALESCE(NEW.points_earned, 0);
  v_project_type := LOWER(NEW.type::text);

  IF v_points > 0 THEN
    IF v_project_type = 'individual' THEN
      SELECT p.id, p.rt_id INTO v_profile_id, v_rt_id
      FROM public.project_members pm
      JOIN public.profiles p ON p.id = pm.user_id
      WHERE pm.project_id = NEW.id LIMIT 1;

      IF v_profile_id IS NOT NULL AND v_rt_id IS NOT NULL THEN
        PERFORM public._add_points_to_rt_rw_and_profile(v_rt_id, v_profile_id, v_points);
      END IF;

    ELSIF v_project_type = 'community' THEN
      SELECT COUNT(*) INTO v_member_count FROM public.project_members WHERE project_id = NEW.id;
      
      IF v_member_count > 0 THEN
        v_share := v_points / v_member_count;
        FOR rec_member IN SELECT user_id FROM public.project_members WHERE project_id = NEW.id LOOP
          SELECT id, rt_id INTO v_profile_id, v_rt_id FROM public.profiles WHERE id = rec_member.user_id;
          IF v_profile_id IS NOT NULL AND v_rt_id IS NOT NULL THEN
            PERFORM public._add_points_to_rt_rw_and_profile(v_rt_id, v_profile_id, v_share);
          END IF;
        END LOOP;
      END IF;
    END IF;
  END IF;

  NEW.points_applied := TRUE;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_points_on_rt_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Hanya jalan jika kolom rt_id berubah
  IF (OLD.rt_id IS DISTINCT FROM NEW.rt_id) THEN
    
    -- 1. Kurangi total poin di RT LAMA
    IF OLD.rt_id IS NOT NULL THEN
      UPDATE public.rt_rw
      SET total_accumulated_points = GREATEST(0, COALESCE(total_accumulated_points, 0) - COALESCE(OLD.total_individual_points, 0))
      WHERE id = OLD.rt_id;
    END IF;

    -- 2. Tambahkan total poin ke RT BARU
    IF NEW.rt_id IS NOT NULL THEN
      UPDATE public.rt_rw
      SET total_accumulated_points = COALESCE(total_accumulated_points, 0) + COALESCE(NEW.total_individual_points, 0)
      WHERE id = NEW.rt_id;
    END IF;

  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_points_in_region()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    current_parent_id VARCHAR;
    total_points FLOAT8;
BEGIN

    IF (TG_OP = 'DELETE') THEN
        current_parent_id := OLD.parent_id;
    ELSE
        current_parent_id := NEW.parent_id;
    END IF;

    IF current_parent_id IS NOT NULL THEN
        SELECT COALESCE(SUM(total_accumulated_points), 0)
        INTO total_points
        FROM region
        WHERE parent_id = current_parent_id;

        UPDATE region 
        SET total_accumulated_points = total_points 
        WHERE id = current_parent_id;
    END IF;

    RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_points_region_from_rtrw()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    target_region_id VARCHAR;
    total_points FLOAT8;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_region_id := OLD.region_id;
    ELSE
        target_region_id := NEW.region_id;
    END IF;

    SELECT COALESCE(SUM(total_accumulated_points), 0) 
    INTO total_points
    FROM rt_rw
    WHERE region_id = target_region_id;

    UPDATE region 
    SET total_accumulated_points = total_points 
    WHERE id = target_region_id;

    RETURN NULL;
END;
$function$
;

grant delete on table "public"."climate_impact_logs" to "anon";

grant insert on table "public"."climate_impact_logs" to "anon";

grant references on table "public"."climate_impact_logs" to "anon";

grant select on table "public"."climate_impact_logs" to "anon";

grant trigger on table "public"."climate_impact_logs" to "anon";

grant truncate on table "public"."climate_impact_logs" to "anon";

grant update on table "public"."climate_impact_logs" to "anon";

grant delete on table "public"."climate_impact_logs" to "authenticated";

grant insert on table "public"."climate_impact_logs" to "authenticated";

grant references on table "public"."climate_impact_logs" to "authenticated";

grant select on table "public"."climate_impact_logs" to "authenticated";

grant trigger on table "public"."climate_impact_logs" to "authenticated";

grant truncate on table "public"."climate_impact_logs" to "authenticated";

grant update on table "public"."climate_impact_logs" to "authenticated";

grant delete on table "public"."climate_impact_logs" to "service_role";

grant insert on table "public"."climate_impact_logs" to "service_role";

grant references on table "public"."climate_impact_logs" to "service_role";

grant select on table "public"."climate_impact_logs" to "service_role";

grant trigger on table "public"."climate_impact_logs" to "service_role";

grant truncate on table "public"."climate_impact_logs" to "service_role";

grant update on table "public"."climate_impact_logs" to "service_role";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."project_members" to "anon";

grant insert on table "public"."project_members" to "anon";

grant references on table "public"."project_members" to "anon";

grant select on table "public"."project_members" to "anon";

grant trigger on table "public"."project_members" to "anon";

grant truncate on table "public"."project_members" to "anon";

grant update on table "public"."project_members" to "anon";

grant delete on table "public"."project_members" to "authenticated";

grant insert on table "public"."project_members" to "authenticated";

grant references on table "public"."project_members" to "authenticated";

grant select on table "public"."project_members" to "authenticated";

grant trigger on table "public"."project_members" to "authenticated";

grant truncate on table "public"."project_members" to "authenticated";

grant update on table "public"."project_members" to "authenticated";

grant delete on table "public"."project_members" to "service_role";

grant insert on table "public"."project_members" to "service_role";

grant references on table "public"."project_members" to "service_role";

grant select on table "public"."project_members" to "service_role";

grant trigger on table "public"."project_members" to "service_role";

grant truncate on table "public"."project_members" to "service_role";

grant update on table "public"."project_members" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant delete on table "public"."region" to "anon";

grant insert on table "public"."region" to "anon";

grant references on table "public"."region" to "anon";

grant select on table "public"."region" to "anon";

grant trigger on table "public"."region" to "anon";

grant truncate on table "public"."region" to "anon";

grant update on table "public"."region" to "anon";

grant delete on table "public"."region" to "authenticated";

grant insert on table "public"."region" to "authenticated";

grant references on table "public"."region" to "authenticated";

grant select on table "public"."region" to "authenticated";

grant trigger on table "public"."region" to "authenticated";

grant truncate on table "public"."region" to "authenticated";

grant update on table "public"."region" to "authenticated";

grant delete on table "public"."region" to "service_role";

grant insert on table "public"."region" to "service_role";

grant references on table "public"."region" to "service_role";

grant select on table "public"."region" to "service_role";

grant trigger on table "public"."region" to "service_role";

grant truncate on table "public"."region" to "service_role";

grant update on table "public"."region" to "service_role";

grant delete on table "public"."rt_rw" to "anon";

grant insert on table "public"."rt_rw" to "anon";

grant references on table "public"."rt_rw" to "anon";

grant select on table "public"."rt_rw" to "anon";

grant trigger on table "public"."rt_rw" to "anon";

grant truncate on table "public"."rt_rw" to "anon";

grant update on table "public"."rt_rw" to "anon";

grant delete on table "public"."rt_rw" to "authenticated";

grant insert on table "public"."rt_rw" to "authenticated";

grant references on table "public"."rt_rw" to "authenticated";

grant select on table "public"."rt_rw" to "authenticated";

grant trigger on table "public"."rt_rw" to "authenticated";

grant truncate on table "public"."rt_rw" to "authenticated";

grant update on table "public"."rt_rw" to "authenticated";

grant delete on table "public"."rt_rw" to "service_role";

grant insert on table "public"."rt_rw" to "service_role";

grant references on table "public"."rt_rw" to "service_role";

grant select on table "public"."rt_rw" to "service_role";

grant trigger on table "public"."rt_rw" to "service_role";

grant truncate on table "public"."rt_rw" to "service_role";

grant update on table "public"."rt_rw" to "service_role";

grant delete on table "public"."wa_order_leads" to "anon";

grant insert on table "public"."wa_order_leads" to "anon";

grant references on table "public"."wa_order_leads" to "anon";

grant select on table "public"."wa_order_leads" to "anon";

grant trigger on table "public"."wa_order_leads" to "anon";

grant truncate on table "public"."wa_order_leads" to "anon";

grant update on table "public"."wa_order_leads" to "anon";

grant delete on table "public"."wa_order_leads" to "authenticated";

grant insert on table "public"."wa_order_leads" to "authenticated";

grant references on table "public"."wa_order_leads" to "authenticated";

grant select on table "public"."wa_order_leads" to "authenticated";

grant trigger on table "public"."wa_order_leads" to "authenticated";

grant truncate on table "public"."wa_order_leads" to "authenticated";

grant update on table "public"."wa_order_leads" to "authenticated";

grant delete on table "public"."wa_order_leads" to "service_role";

grant insert on table "public"."wa_order_leads" to "service_role";

grant references on table "public"."wa_order_leads" to "service_role";

grant select on table "public"."wa_order_leads" to "service_role";

grant trigger on table "public"."wa_order_leads" to "service_role";

grant truncate on table "public"."wa_order_leads" to "service_role";

grant update on table "public"."wa_order_leads" to "service_role";

CREATE TRIGGER trg_profile_rt_move AFTER UPDATE OF rt_id ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.sync_points_on_rt_change();

CREATE TRIGGER trg_projects_points_sync BEFORE INSERT OR UPDATE OF ai_validation_status ON public.projects FOR EACH ROW EXECUTE FUNCTION public.projects_points_sync();

CREATE TRIGGER trigger_generate_join_code BEFORE INSERT ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_generate_join_code();

CREATE TRIGGER trg_generate_region_id BEFORE INSERT ON public.region FOR EACH ROW EXECUTE FUNCTION public.generate_region_id();

CREATE TRIGGER trg_points_update_in_region AFTER UPDATE OF total_accumulated_points ON public.region FOR EACH ROW WHEN ((old.total_accumulated_points IS DISTINCT FROM new.total_accumulated_points)) EXECUTE FUNCTION public.update_points_in_region();

CREATE TRIGGER trg_points_rtrw_to_region AFTER INSERT OR DELETE OR UPDATE ON public.rt_rw FOR EACH ROW EXECUTE FUNCTION public.update_points_region_from_rtrw();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "all can do 1iiiika_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'projects'::text));



  create policy "all can do 1iiiika_1"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'projects'::text));



  create policy "all can do 1iiiika_2"
  on "storage"."objects"
  as permissive
  for delete
  to public
using ((bucket_id = 'projects'::text));



  create policy "all can do 1iiiika_3"
  on "storage"."objects"
  as permissive
  for update
  to public
using ((bucket_id = 'projects'::text));



