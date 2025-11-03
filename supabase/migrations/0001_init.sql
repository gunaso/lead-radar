create type "public"."sentiment" as enum ('Positive', 'Negative', 'Neutral');

create type "public"."status" as enum ('-1', '0', '1', '2', '3');


  create table "public"."competitors" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "created_by" uuid not null,
    "updated_by" uuid,
    "name" text not null,
    "website" text,
    "website_md" text,
    "website_ai" text,
    "workspace" uuid not null
      );


alter table "public"."competitors" enable row level security;


  create table "public"."keywords" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "value" text not null,
    "process" boolean not null default true,
    "similar_words" text[]
      );


alter table "public"."keywords" enable row level security;


  create table "public"."profiles" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "name" text,
    "role" text,
    "onboarding" smallint not null default '0'::smallint,
    "onboarded" boolean not null default false,
    "workspace" uuid
      );


alter table "public"."profiles" enable row level security;


  create table "public"."reddit_comments" (
    "id" uuid not null default gen_random_uuid(),
    "imported_at" timestamp with time zone not null default now(),
    "posted_at" timestamp with time zone,
    "post" uuid not null,
    "reddit_user" uuid,
    "content" text,
    "summary" text,
    "sentiment" public.sentiment not null default 'Neutral'::public.sentiment,
    "score" integer not null default 0,
    "processed" boolean not null default false,
    "display" boolean not null default false,
    "url" text
      );


alter table "public"."reddit_comments" enable row level security;


  create table "public"."reddit_comments_keywords" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "comment" uuid not null,
    "keyword" uuid not null
      );


alter table "public"."reddit_comments_keywords" enable row level security;


  create table "public"."reddit_posts" (
    "id" uuid not null default gen_random_uuid(),
    "imported_at" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone,
    "subreddit" uuid not null,
    "reddit_user" uuid,
    "title" text,
    "content" text,
    "summary" text,
    "bullet_points" text,
    "sentiment" public.sentiment not null default 'Neutral'::public.sentiment,
    "score" integer not null default 0,
    "processed" boolean not null default false,
    "display" boolean not null default false,
    "url" text,
    "reply" text
      );


alter table "public"."reddit_posts" enable row level security;


  create table "public"."reddit_posts_keywords" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "keyword" uuid not null,
    "post" uuid not null
      );


alter table "public"."reddit_posts_keywords" enable row level security;


  create table "public"."reddit_users" (
    "id" uuid not null default gen_random_uuid(),
    "imported_at" timestamp with time zone not null default now(),
    "username" text not null
      );


alter table "public"."reddit_users" enable row level security;


  create table "public"."subreddits" (
    "id" uuid not null default gen_random_uuid(),
    "imported_at" timestamp with time zone not null default now(),
    "updated" timestamp with time zone,
    "name" text not null,
    "title" text,
    "description" text,
    "description_reddit" text,
    "rules" text,
    "image" text
      );


alter table "public"."subreddits" enable row level security;


  create table "public"."subreddits_keywords" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "keyword" uuid not null,
    "subreddit" uuid not null
      );


alter table "public"."subreddits_keywords" enable row level security;


  create table "public"."workspaces" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "owner" uuid not null,
    "name" text not null,
    "company" text not null,
    "website" text,
    "website_md" text,
    "website_ai" text,
    "employees" text,
    "keywords_suggested" text[],
    "goal" text[],
    "source" text
      );


alter table "public"."workspaces" enable row level security;


  create table "public"."workspaces_keywords" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "created_by" uuid not null,
    "updated_by" uuid,
    "keyword" uuid not null,
    "workspace" uuid not null
      );


alter table "public"."workspaces_keywords" enable row level security;


  create table "public"."workspaces_reddit_comments" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "created_by" uuid not null,
    "updated_by" uuid,
    "workspace" uuid not null,
    "comment" uuid not null,
    "score" integer,
    "status" public.status,
    "reply" text[]
      );


alter table "public"."workspaces_reddit_comments" enable row level security;


  create table "public"."workspaces_reddit_posts" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "created_by" uuid not null,
    "updated_by" uuid,
    "workspace" uuid not null,
    "post" uuid not null,
    "score" integer,
    "status" public.status,
    "reply" text[]
      );


alter table "public"."workspaces_reddit_posts" enable row level security;


  create table "public"."workspaces_subreddits" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid not null,
    "subreddit" uuid not null,
    "workspace" uuid not null
      );


alter table "public"."workspaces_subreddits" enable row level security;

CREATE UNIQUE INDEX competitors_pkey ON public.competitors USING btree (id);

CREATE INDEX competitors_workspace_idx ON public.competitors USING btree (workspace);

CREATE UNIQUE INDEX keywords_pkey ON public.keywords USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (user_id);

CREATE INDEX reddit_comments_keywords_comment_idx ON public.reddit_comments_keywords USING btree (comment);

CREATE INDEX reddit_comments_keywords_keyword_idx ON public.reddit_comments_keywords USING btree (keyword);

CREATE UNIQUE INDEX reddit_comments_keywords_pkey ON public.reddit_comments_keywords USING btree (id);

CREATE UNIQUE INDEX reddit_comments_pkey ON public.reddit_comments USING btree (id);

CREATE INDEX reddit_comments_post_idx ON public.reddit_comments USING btree (post);

CREATE INDEX reddit_posts_keywords_keyword_idx ON public.reddit_posts_keywords USING btree (keyword);

CREATE UNIQUE INDEX reddit_posts_keywords_pkey ON public.reddit_posts_keywords USING btree (id);

CREATE INDEX reddit_posts_keywords_post_idx ON public.reddit_posts_keywords USING btree (post);

CREATE UNIQUE INDEX reddit_posts_pkey ON public.reddit_posts USING btree (id);

CREATE INDEX reddit_posts_subreddit_idx ON public.reddit_posts USING btree (subreddit);

CREATE UNIQUE INDEX reddit_users_pkey ON public.reddit_users USING btree (id);

CREATE INDEX subreddits_keywords_keyword_idx ON public.subreddits_keywords USING btree (keyword);

CREATE UNIQUE INDEX subreddits_keywords_pkey ON public.subreddits_keywords USING btree (id);

CREATE INDEX subreddits_keywords_subreddit_idx ON public.subreddits_keywords USING btree (subreddit);

CREATE UNIQUE INDEX subreddits_name_key ON public.subreddits USING btree (name);

CREATE UNIQUE INDEX subreddits_pkey ON public.subreddits USING btree (id);

CREATE INDEX workspaces_keywords_keyword_idx ON public.workspaces_keywords USING btree (keyword);

CREATE UNIQUE INDEX workspaces_keywords_pkey ON public.workspaces_keywords USING btree (id);

CREATE INDEX workspaces_keywords_workspace_idx ON public.workspaces_keywords USING btree (workspace);

CREATE UNIQUE INDEX workspaces_pkey ON public.workspaces USING btree (id);

CREATE INDEX workspaces_reddit_comments_comment_idx ON public.workspaces_reddit_comments USING btree (comment);

CREATE UNIQUE INDEX workspaces_reddit_comments_pkey ON public.workspaces_reddit_comments USING btree (id);

CREATE INDEX workspaces_reddit_comments_workspace_idx ON public.workspaces_reddit_comments USING btree (workspace);

CREATE UNIQUE INDEX workspaces_reddit_posts_pkey ON public.workspaces_reddit_posts USING btree (id);

CREATE INDEX workspaces_reddit_posts_post_idx ON public.workspaces_reddit_posts USING btree (post);

CREATE INDEX workspaces_reddit_posts_workspace_idx ON public.workspaces_reddit_posts USING btree (workspace);

CREATE UNIQUE INDEX workspaces_subreddits_pkey ON public.workspaces_subreddits USING btree (id);

CREATE INDEX workspaces_subreddits_subreddit_idx ON public.workspaces_subreddits USING btree (subreddit);

CREATE INDEX workspaces_subreddits_workspace_idx ON public.workspaces_subreddits USING btree (workspace);

alter table "public"."competitors" add constraint "competitors_pkey" PRIMARY KEY using index "competitors_pkey";

alter table "public"."keywords" add constraint "keywords_pkey" PRIMARY KEY using index "keywords_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."reddit_comments" add constraint "reddit_comments_pkey" PRIMARY KEY using index "reddit_comments_pkey";

alter table "public"."reddit_comments_keywords" add constraint "reddit_comments_keywords_pkey" PRIMARY KEY using index "reddit_comments_keywords_pkey";

alter table "public"."reddit_posts" add constraint "reddit_posts_pkey" PRIMARY KEY using index "reddit_posts_pkey";

alter table "public"."reddit_posts_keywords" add constraint "reddit_posts_keywords_pkey" PRIMARY KEY using index "reddit_posts_keywords_pkey";

alter table "public"."reddit_users" add constraint "reddit_users_pkey" PRIMARY KEY using index "reddit_users_pkey";

alter table "public"."subreddits" add constraint "subreddits_pkey" PRIMARY KEY using index "subreddits_pkey";

alter table "public"."subreddits_keywords" add constraint "subreddits_keywords_pkey" PRIMARY KEY using index "subreddits_keywords_pkey";

alter table "public"."workspaces" add constraint "workspaces_pkey" PRIMARY KEY using index "workspaces_pkey";

alter table "public"."workspaces_keywords" add constraint "workspaces_keywords_pkey" PRIMARY KEY using index "workspaces_keywords_pkey";

alter table "public"."workspaces_reddit_comments" add constraint "workspaces_reddit_comments_pkey" PRIMARY KEY using index "workspaces_reddit_comments_pkey";

alter table "public"."workspaces_reddit_posts" add constraint "workspaces_reddit_posts_pkey" PRIMARY KEY using index "workspaces_reddit_posts_pkey";

alter table "public"."workspaces_subreddits" add constraint "workspaces_subreddits_pkey" PRIMARY KEY using index "workspaces_subreddits_pkey";

alter table "public"."competitors" add constraint "competitors_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."competitors" validate constraint "competitors_created_by_fkey";

alter table "public"."competitors" add constraint "competitors_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."competitors" validate constraint "competitors_updated_by_fkey";

alter table "public"."competitors" add constraint "competitors_workspace_fkey" FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."competitors" validate constraint "competitors_workspace_fkey";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_workspace_fkey" FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_workspace_fkey";

alter table "public"."reddit_comments" add constraint "reddit_comments_post_fkey" FOREIGN KEY (post) REFERENCES public.reddit_posts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reddit_comments" validate constraint "reddit_comments_post_fkey";

alter table "public"."reddit_comments" add constraint "reddit_comments_reddit_user_fkey" FOREIGN KEY (reddit_user) REFERENCES public.reddit_users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."reddit_comments" validate constraint "reddit_comments_reddit_user_fkey";

alter table "public"."reddit_comments" add constraint "reddit_comments_score_check" CHECK (((score >= 0) AND (score <= 100))) not valid;

alter table "public"."reddit_comments" validate constraint "reddit_comments_score_check";

alter table "public"."reddit_comments_keywords" add constraint "reddit_comments_keywords_comment_fkey" FOREIGN KEY (comment) REFERENCES public.reddit_comments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reddit_comments_keywords" validate constraint "reddit_comments_keywords_comment_fkey";

alter table "public"."reddit_comments_keywords" add constraint "reddit_comments_keywords_keyword_fkey" FOREIGN KEY (keyword) REFERENCES public.keywords(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reddit_comments_keywords" validate constraint "reddit_comments_keywords_keyword_fkey";

alter table "public"."reddit_posts" add constraint "reddit_posts_reddit_user_fkey" FOREIGN KEY (reddit_user) REFERENCES public.reddit_users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."reddit_posts" validate constraint "reddit_posts_reddit_user_fkey";

alter table "public"."reddit_posts" add constraint "reddit_posts_score_check" CHECK (((score >= 0) AND (score <= 100))) not valid;

alter table "public"."reddit_posts" validate constraint "reddit_posts_score_check";

alter table "public"."reddit_posts" add constraint "reddit_posts_subreddit_fkey" FOREIGN KEY (subreddit) REFERENCES public.subreddits(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reddit_posts" validate constraint "reddit_posts_subreddit_fkey";

alter table "public"."reddit_posts_keywords" add constraint "reddit_posts_keywords_keyword_fkey" FOREIGN KEY (keyword) REFERENCES public.keywords(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reddit_posts_keywords" validate constraint "reddit_posts_keywords_keyword_fkey";

alter table "public"."reddit_posts_keywords" add constraint "reddit_posts_keywords_post_fkey" FOREIGN KEY (post) REFERENCES public.reddit_posts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reddit_posts_keywords" validate constraint "reddit_posts_keywords_post_fkey";

alter table "public"."subreddits" add constraint "subreddits_name_key" UNIQUE using index "subreddits_name_key";

alter table "public"."subreddits_keywords" add constraint "subreddits_keywords_keyword_fkey" FOREIGN KEY (keyword) REFERENCES public.keywords(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."subreddits_keywords" validate constraint "subreddits_keywords_keyword_fkey";

alter table "public"."subreddits_keywords" add constraint "subreddits_keywords_subreddit_fkey" FOREIGN KEY (subreddit) REFERENCES public.subreddits(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."subreddits_keywords" validate constraint "subreddits_keywords_subreddit_fkey";

alter table "public"."workspaces" add constraint "workspaces_owner_fkey" FOREIGN KEY (owner) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspaces" validate constraint "workspaces_owner_fkey";

alter table "public"."workspaces_keywords" add constraint "workspaces_keywords_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspaces_keywords" validate constraint "workspaces_keywords_created_by_fkey";

alter table "public"."workspaces_keywords" add constraint "workspaces_keywords_keyword_fkey" FOREIGN KEY (keyword) REFERENCES public.keywords(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspaces_keywords" validate constraint "workspaces_keywords_keyword_fkey";

alter table "public"."workspaces_keywords" add constraint "workspaces_keywords_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."workspaces_keywords" validate constraint "workspaces_keywords_updated_by_fkey";

alter table "public"."workspaces_keywords" add constraint "workspaces_keywords_workspace_fkey" FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspaces_keywords" validate constraint "workspaces_keywords_workspace_fkey";

alter table "public"."workspaces_reddit_comments" add constraint "workspaces_reddit_comments_comment_fkey" FOREIGN KEY (comment) REFERENCES public.reddit_comments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspaces_reddit_comments" validate constraint "workspaces_reddit_comments_comment_fkey";

alter table "public"."workspaces_reddit_comments" add constraint "workspaces_reddit_comments_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspaces_reddit_comments" validate constraint "workspaces_reddit_comments_created_by_fkey";

alter table "public"."workspaces_reddit_comments" add constraint "workspaces_reddit_comments_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."workspaces_reddit_comments" validate constraint "workspaces_reddit_comments_updated_by_fkey";

alter table "public"."workspaces_reddit_comments" add constraint "workspaces_reddit_comments_workspace_fkey" FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspaces_reddit_comments" validate constraint "workspaces_reddit_comments_workspace_fkey";

alter table "public"."workspaces_reddit_posts" add constraint "workspaces_reddit_posts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspaces_reddit_posts" validate constraint "workspaces_reddit_posts_created_by_fkey";

alter table "public"."workspaces_reddit_posts" add constraint "workspaces_reddit_posts_post_fkey" FOREIGN KEY (post) REFERENCES public.reddit_posts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspaces_reddit_posts" validate constraint "workspaces_reddit_posts_post_fkey";

alter table "public"."workspaces_reddit_posts" add constraint "workspaces_reddit_posts_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."workspaces_reddit_posts" validate constraint "workspaces_reddit_posts_updated_by_fkey";

alter table "public"."workspaces_reddit_posts" add constraint "workspaces_reddit_posts_workspace_fkey" FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspaces_reddit_posts" validate constraint "workspaces_reddit_posts_workspace_fkey";

alter table "public"."workspaces_subreddits" add constraint "workspaces_subreddits_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."workspaces_subreddits" validate constraint "workspaces_subreddits_created_by_fkey";

alter table "public"."workspaces_subreddits" add constraint "workspaces_subreddits_subreddit_fkey" FOREIGN KEY (subreddit) REFERENCES public.subreddits(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspaces_subreddits" validate constraint "workspaces_subreddits_subreddit_fkey";

alter table "public"."workspaces_subreddits" add constraint "workspaces_subreddits_workspace_fkey" FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspaces_subreddits" validate constraint "workspaces_subreddits_workspace_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (user_id, created_at)
  values (new.id, now());
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."competitors" to "anon";

grant insert on table "public"."competitors" to "anon";

grant references on table "public"."competitors" to "anon";

grant select on table "public"."competitors" to "anon";

grant trigger on table "public"."competitors" to "anon";

grant truncate on table "public"."competitors" to "anon";

grant update on table "public"."competitors" to "anon";

grant delete on table "public"."competitors" to "authenticated";

grant insert on table "public"."competitors" to "authenticated";

grant references on table "public"."competitors" to "authenticated";

grant select on table "public"."competitors" to "authenticated";

grant trigger on table "public"."competitors" to "authenticated";

grant truncate on table "public"."competitors" to "authenticated";

grant update on table "public"."competitors" to "authenticated";

grant delete on table "public"."competitors" to "service_role";

grant insert on table "public"."competitors" to "service_role";

grant references on table "public"."competitors" to "service_role";

grant select on table "public"."competitors" to "service_role";

grant trigger on table "public"."competitors" to "service_role";

grant truncate on table "public"."competitors" to "service_role";

grant update on table "public"."competitors" to "service_role";

grant delete on table "public"."keywords" to "anon";

grant insert on table "public"."keywords" to "anon";

grant references on table "public"."keywords" to "anon";

grant select on table "public"."keywords" to "anon";

grant trigger on table "public"."keywords" to "anon";

grant truncate on table "public"."keywords" to "anon";

grant update on table "public"."keywords" to "anon";

grant delete on table "public"."keywords" to "authenticated";

grant insert on table "public"."keywords" to "authenticated";

grant references on table "public"."keywords" to "authenticated";

grant select on table "public"."keywords" to "authenticated";

grant trigger on table "public"."keywords" to "authenticated";

grant truncate on table "public"."keywords" to "authenticated";

grant update on table "public"."keywords" to "authenticated";

grant delete on table "public"."keywords" to "service_role";

grant insert on table "public"."keywords" to "service_role";

grant references on table "public"."keywords" to "service_role";

grant select on table "public"."keywords" to "service_role";

grant trigger on table "public"."keywords" to "service_role";

grant truncate on table "public"."keywords" to "service_role";

grant update on table "public"."keywords" to "service_role";

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

grant delete on table "public"."reddit_comments" to "anon";

grant insert on table "public"."reddit_comments" to "anon";

grant references on table "public"."reddit_comments" to "anon";

grant select on table "public"."reddit_comments" to "anon";

grant trigger on table "public"."reddit_comments" to "anon";

grant truncate on table "public"."reddit_comments" to "anon";

grant update on table "public"."reddit_comments" to "anon";

grant delete on table "public"."reddit_comments" to "authenticated";

grant insert on table "public"."reddit_comments" to "authenticated";

grant references on table "public"."reddit_comments" to "authenticated";

grant select on table "public"."reddit_comments" to "authenticated";

grant trigger on table "public"."reddit_comments" to "authenticated";

grant truncate on table "public"."reddit_comments" to "authenticated";

grant update on table "public"."reddit_comments" to "authenticated";

grant delete on table "public"."reddit_comments" to "service_role";

grant insert on table "public"."reddit_comments" to "service_role";

grant references on table "public"."reddit_comments" to "service_role";

grant select on table "public"."reddit_comments" to "service_role";

grant trigger on table "public"."reddit_comments" to "service_role";

grant truncate on table "public"."reddit_comments" to "service_role";

grant update on table "public"."reddit_comments" to "service_role";

grant delete on table "public"."reddit_comments_keywords" to "anon";

grant insert on table "public"."reddit_comments_keywords" to "anon";

grant references on table "public"."reddit_comments_keywords" to "anon";

grant select on table "public"."reddit_comments_keywords" to "anon";

grant trigger on table "public"."reddit_comments_keywords" to "anon";

grant truncate on table "public"."reddit_comments_keywords" to "anon";

grant update on table "public"."reddit_comments_keywords" to "anon";

grant delete on table "public"."reddit_comments_keywords" to "authenticated";

grant insert on table "public"."reddit_comments_keywords" to "authenticated";

grant references on table "public"."reddit_comments_keywords" to "authenticated";

grant select on table "public"."reddit_comments_keywords" to "authenticated";

grant trigger on table "public"."reddit_comments_keywords" to "authenticated";

grant truncate on table "public"."reddit_comments_keywords" to "authenticated";

grant update on table "public"."reddit_comments_keywords" to "authenticated";

grant delete on table "public"."reddit_comments_keywords" to "service_role";

grant insert on table "public"."reddit_comments_keywords" to "service_role";

grant references on table "public"."reddit_comments_keywords" to "service_role";

grant select on table "public"."reddit_comments_keywords" to "service_role";

grant trigger on table "public"."reddit_comments_keywords" to "service_role";

grant truncate on table "public"."reddit_comments_keywords" to "service_role";

grant update on table "public"."reddit_comments_keywords" to "service_role";

grant delete on table "public"."reddit_posts" to "anon";

grant insert on table "public"."reddit_posts" to "anon";

grant references on table "public"."reddit_posts" to "anon";

grant select on table "public"."reddit_posts" to "anon";

grant trigger on table "public"."reddit_posts" to "anon";

grant truncate on table "public"."reddit_posts" to "anon";

grant update on table "public"."reddit_posts" to "anon";

grant delete on table "public"."reddit_posts" to "authenticated";

grant insert on table "public"."reddit_posts" to "authenticated";

grant references on table "public"."reddit_posts" to "authenticated";

grant select on table "public"."reddit_posts" to "authenticated";

grant trigger on table "public"."reddit_posts" to "authenticated";

grant truncate on table "public"."reddit_posts" to "authenticated";

grant update on table "public"."reddit_posts" to "authenticated";

grant delete on table "public"."reddit_posts" to "service_role";

grant insert on table "public"."reddit_posts" to "service_role";

grant references on table "public"."reddit_posts" to "service_role";

grant select on table "public"."reddit_posts" to "service_role";

grant trigger on table "public"."reddit_posts" to "service_role";

grant truncate on table "public"."reddit_posts" to "service_role";

grant update on table "public"."reddit_posts" to "service_role";

grant delete on table "public"."reddit_posts_keywords" to "anon";

grant insert on table "public"."reddit_posts_keywords" to "anon";

grant references on table "public"."reddit_posts_keywords" to "anon";

grant select on table "public"."reddit_posts_keywords" to "anon";

grant trigger on table "public"."reddit_posts_keywords" to "anon";

grant truncate on table "public"."reddit_posts_keywords" to "anon";

grant update on table "public"."reddit_posts_keywords" to "anon";

grant delete on table "public"."reddit_posts_keywords" to "authenticated";

grant insert on table "public"."reddit_posts_keywords" to "authenticated";

grant references on table "public"."reddit_posts_keywords" to "authenticated";

grant select on table "public"."reddit_posts_keywords" to "authenticated";

grant trigger on table "public"."reddit_posts_keywords" to "authenticated";

grant truncate on table "public"."reddit_posts_keywords" to "authenticated";

grant update on table "public"."reddit_posts_keywords" to "authenticated";

grant delete on table "public"."reddit_posts_keywords" to "service_role";

grant insert on table "public"."reddit_posts_keywords" to "service_role";

grant references on table "public"."reddit_posts_keywords" to "service_role";

grant select on table "public"."reddit_posts_keywords" to "service_role";

grant trigger on table "public"."reddit_posts_keywords" to "service_role";

grant truncate on table "public"."reddit_posts_keywords" to "service_role";

grant update on table "public"."reddit_posts_keywords" to "service_role";

grant delete on table "public"."reddit_users" to "anon";

grant insert on table "public"."reddit_users" to "anon";

grant references on table "public"."reddit_users" to "anon";

grant select on table "public"."reddit_users" to "anon";

grant trigger on table "public"."reddit_users" to "anon";

grant truncate on table "public"."reddit_users" to "anon";

grant update on table "public"."reddit_users" to "anon";

grant delete on table "public"."reddit_users" to "authenticated";

grant insert on table "public"."reddit_users" to "authenticated";

grant references on table "public"."reddit_users" to "authenticated";

grant select on table "public"."reddit_users" to "authenticated";

grant trigger on table "public"."reddit_users" to "authenticated";

grant truncate on table "public"."reddit_users" to "authenticated";

grant update on table "public"."reddit_users" to "authenticated";

grant delete on table "public"."reddit_users" to "service_role";

grant insert on table "public"."reddit_users" to "service_role";

grant references on table "public"."reddit_users" to "service_role";

grant select on table "public"."reddit_users" to "service_role";

grant trigger on table "public"."reddit_users" to "service_role";

grant truncate on table "public"."reddit_users" to "service_role";

grant update on table "public"."reddit_users" to "service_role";

grant delete on table "public"."subreddits" to "anon";

grant insert on table "public"."subreddits" to "anon";

grant references on table "public"."subreddits" to "anon";

grant select on table "public"."subreddits" to "anon";

grant trigger on table "public"."subreddits" to "anon";

grant truncate on table "public"."subreddits" to "anon";

grant update on table "public"."subreddits" to "anon";

grant delete on table "public"."subreddits" to "authenticated";

grant insert on table "public"."subreddits" to "authenticated";

grant references on table "public"."subreddits" to "authenticated";

grant select on table "public"."subreddits" to "authenticated";

grant trigger on table "public"."subreddits" to "authenticated";

grant truncate on table "public"."subreddits" to "authenticated";

grant update on table "public"."subreddits" to "authenticated";

grant delete on table "public"."subreddits" to "service_role";

grant insert on table "public"."subreddits" to "service_role";

grant references on table "public"."subreddits" to "service_role";

grant select on table "public"."subreddits" to "service_role";

grant trigger on table "public"."subreddits" to "service_role";

grant truncate on table "public"."subreddits" to "service_role";

grant update on table "public"."subreddits" to "service_role";

grant delete on table "public"."subreddits_keywords" to "anon";

grant insert on table "public"."subreddits_keywords" to "anon";

grant references on table "public"."subreddits_keywords" to "anon";

grant select on table "public"."subreddits_keywords" to "anon";

grant trigger on table "public"."subreddits_keywords" to "anon";

grant truncate on table "public"."subreddits_keywords" to "anon";

grant update on table "public"."subreddits_keywords" to "anon";

grant delete on table "public"."subreddits_keywords" to "authenticated";

grant insert on table "public"."subreddits_keywords" to "authenticated";

grant references on table "public"."subreddits_keywords" to "authenticated";

grant select on table "public"."subreddits_keywords" to "authenticated";

grant trigger on table "public"."subreddits_keywords" to "authenticated";

grant truncate on table "public"."subreddits_keywords" to "authenticated";

grant update on table "public"."subreddits_keywords" to "authenticated";

grant delete on table "public"."subreddits_keywords" to "service_role";

grant insert on table "public"."subreddits_keywords" to "service_role";

grant references on table "public"."subreddits_keywords" to "service_role";

grant select on table "public"."subreddits_keywords" to "service_role";

grant trigger on table "public"."subreddits_keywords" to "service_role";

grant truncate on table "public"."subreddits_keywords" to "service_role";

grant update on table "public"."subreddits_keywords" to "service_role";

grant delete on table "public"."workspaces" to "anon";

grant insert on table "public"."workspaces" to "anon";

grant references on table "public"."workspaces" to "anon";

grant select on table "public"."workspaces" to "anon";

grant trigger on table "public"."workspaces" to "anon";

grant truncate on table "public"."workspaces" to "anon";

grant update on table "public"."workspaces" to "anon";

grant delete on table "public"."workspaces" to "authenticated";

grant insert on table "public"."workspaces" to "authenticated";

grant references on table "public"."workspaces" to "authenticated";

grant select on table "public"."workspaces" to "authenticated";

grant trigger on table "public"."workspaces" to "authenticated";

grant truncate on table "public"."workspaces" to "authenticated";

grant update on table "public"."workspaces" to "authenticated";

grant delete on table "public"."workspaces" to "service_role";

grant insert on table "public"."workspaces" to "service_role";

grant references on table "public"."workspaces" to "service_role";

grant select on table "public"."workspaces" to "service_role";

grant trigger on table "public"."workspaces" to "service_role";

grant truncate on table "public"."workspaces" to "service_role";

grant update on table "public"."workspaces" to "service_role";

grant delete on table "public"."workspaces_keywords" to "anon";

grant insert on table "public"."workspaces_keywords" to "anon";

grant references on table "public"."workspaces_keywords" to "anon";

grant select on table "public"."workspaces_keywords" to "anon";

grant trigger on table "public"."workspaces_keywords" to "anon";

grant truncate on table "public"."workspaces_keywords" to "anon";

grant update on table "public"."workspaces_keywords" to "anon";

grant delete on table "public"."workspaces_keywords" to "authenticated";

grant insert on table "public"."workspaces_keywords" to "authenticated";

grant references on table "public"."workspaces_keywords" to "authenticated";

grant select on table "public"."workspaces_keywords" to "authenticated";

grant trigger on table "public"."workspaces_keywords" to "authenticated";

grant truncate on table "public"."workspaces_keywords" to "authenticated";

grant update on table "public"."workspaces_keywords" to "authenticated";

grant delete on table "public"."workspaces_keywords" to "service_role";

grant insert on table "public"."workspaces_keywords" to "service_role";

grant references on table "public"."workspaces_keywords" to "service_role";

grant select on table "public"."workspaces_keywords" to "service_role";

grant trigger on table "public"."workspaces_keywords" to "service_role";

grant truncate on table "public"."workspaces_keywords" to "service_role";

grant update on table "public"."workspaces_keywords" to "service_role";

grant delete on table "public"."workspaces_reddit_comments" to "anon";

grant insert on table "public"."workspaces_reddit_comments" to "anon";

grant references on table "public"."workspaces_reddit_comments" to "anon";

grant select on table "public"."workspaces_reddit_comments" to "anon";

grant trigger on table "public"."workspaces_reddit_comments" to "anon";

grant truncate on table "public"."workspaces_reddit_comments" to "anon";

grant update on table "public"."workspaces_reddit_comments" to "anon";

grant delete on table "public"."workspaces_reddit_comments" to "authenticated";

grant insert on table "public"."workspaces_reddit_comments" to "authenticated";

grant references on table "public"."workspaces_reddit_comments" to "authenticated";

grant select on table "public"."workspaces_reddit_comments" to "authenticated";

grant trigger on table "public"."workspaces_reddit_comments" to "authenticated";

grant truncate on table "public"."workspaces_reddit_comments" to "authenticated";

grant update on table "public"."workspaces_reddit_comments" to "authenticated";

grant delete on table "public"."workspaces_reddit_comments" to "service_role";

grant insert on table "public"."workspaces_reddit_comments" to "service_role";

grant references on table "public"."workspaces_reddit_comments" to "service_role";

grant select on table "public"."workspaces_reddit_comments" to "service_role";

grant trigger on table "public"."workspaces_reddit_comments" to "service_role";

grant truncate on table "public"."workspaces_reddit_comments" to "service_role";

grant update on table "public"."workspaces_reddit_comments" to "service_role";

grant delete on table "public"."workspaces_reddit_posts" to "anon";

grant insert on table "public"."workspaces_reddit_posts" to "anon";

grant references on table "public"."workspaces_reddit_posts" to "anon";

grant select on table "public"."workspaces_reddit_posts" to "anon";

grant trigger on table "public"."workspaces_reddit_posts" to "anon";

grant truncate on table "public"."workspaces_reddit_posts" to "anon";

grant update on table "public"."workspaces_reddit_posts" to "anon";

grant delete on table "public"."workspaces_reddit_posts" to "authenticated";

grant insert on table "public"."workspaces_reddit_posts" to "authenticated";

grant references on table "public"."workspaces_reddit_posts" to "authenticated";

grant select on table "public"."workspaces_reddit_posts" to "authenticated";

grant trigger on table "public"."workspaces_reddit_posts" to "authenticated";

grant truncate on table "public"."workspaces_reddit_posts" to "authenticated";

grant update on table "public"."workspaces_reddit_posts" to "authenticated";

grant delete on table "public"."workspaces_reddit_posts" to "service_role";

grant insert on table "public"."workspaces_reddit_posts" to "service_role";

grant references on table "public"."workspaces_reddit_posts" to "service_role";

grant select on table "public"."workspaces_reddit_posts" to "service_role";

grant trigger on table "public"."workspaces_reddit_posts" to "service_role";

grant truncate on table "public"."workspaces_reddit_posts" to "service_role";

grant update on table "public"."workspaces_reddit_posts" to "service_role";

grant delete on table "public"."workspaces_subreddits" to "anon";

grant insert on table "public"."workspaces_subreddits" to "anon";

grant references on table "public"."workspaces_subreddits" to "anon";

grant select on table "public"."workspaces_subreddits" to "anon";

grant trigger on table "public"."workspaces_subreddits" to "anon";

grant truncate on table "public"."workspaces_subreddits" to "anon";

grant update on table "public"."workspaces_subreddits" to "anon";

grant delete on table "public"."workspaces_subreddits" to "authenticated";

grant insert on table "public"."workspaces_subreddits" to "authenticated";

grant references on table "public"."workspaces_subreddits" to "authenticated";

grant select on table "public"."workspaces_subreddits" to "authenticated";

grant trigger on table "public"."workspaces_subreddits" to "authenticated";

grant truncate on table "public"."workspaces_subreddits" to "authenticated";

grant update on table "public"."workspaces_subreddits" to "authenticated";

grant delete on table "public"."workspaces_subreddits" to "service_role";

grant insert on table "public"."workspaces_subreddits" to "service_role";

grant references on table "public"."workspaces_subreddits" to "service_role";

grant select on table "public"."workspaces_subreddits" to "service_role";

grant trigger on table "public"."workspaces_subreddits" to "service_role";

grant truncate on table "public"."workspaces_subreddits" to "service_role";

grant update on table "public"."workspaces_subreddits" to "service_role";


  create policy "Members can ALL"
  on "public"."competitors"
  as permissive
  for all
  to authenticated
using (((created_by = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = competitors.workspace))))))
with check (((created_by = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = competitors.workspace))))));



  create policy "Everyone can insert"
  on "public"."keywords"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Everyone can select"
  on "public"."keywords"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Owner can delete"
  on "public"."profiles"
  as permissive
  for delete
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Owner can select"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Owner can update"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)))
with check ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Every can select"
  on "public"."reddit_comments"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Everyone can select"
  on "public"."reddit_comments_keywords"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Everyone can select"
  on "public"."reddit_posts"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Everyone can select"
  on "public"."reddit_posts_keywords"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Everyone can select"
  on "public"."reddit_users"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Everyone can insert"
  on "public"."subreddits"
  as permissive
  for insert
  to public
with check (true);



  create policy "Everyone can select"
  on "public"."subreddits"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Everyone can select"
  on "public"."subreddits_keywords"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Only members select"
  on "public"."workspaces"
  as permissive
  for select
  to authenticated
using (((owner = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces.id))))));



  create policy "Only members update"
  on "public"."workspaces"
  as permissive
  for update
  to authenticated
using (((owner = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces.id))))))
with check (((owner = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces.id))))));



  create policy "Only owner delete"
  on "public"."workspaces"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = owner));



  create policy "Only owner insert"
  on "public"."workspaces"
  as permissive
  for insert
  to authenticated
with check ((owner = ( SELECT auth.uid() AS uid)));



  create policy "Only members delete"
  on "public"."workspaces_keywords"
  as permissive
  for delete
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.workspaces w
  WHERE ((w.id = workspaces_keywords.workspace) AND (w.owner = ( SELECT auth.uid() AS uid))))) OR (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces_keywords.workspace))))));



  create policy "Only members insert"
  on "public"."workspaces_keywords"
  as permissive
  for insert
  to authenticated
with check (((EXISTS ( SELECT 1
   FROM public.workspaces w
  WHERE ((w.id = workspaces_keywords.workspace) AND (w.owner = ( SELECT auth.uid() AS uid))))) OR (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces_keywords.workspace))))));



  create policy "Only members select"
  on "public"."workspaces_keywords"
  as permissive
  for select
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.workspaces w
  WHERE ((w.id = workspaces_keywords.workspace) AND (w.owner = ( SELECT auth.uid() AS uid))))) OR (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces_keywords.workspace))))));



  create policy "Members can insert"
  on "public"."workspaces_reddit_comments"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces_reddit_comments.workspace)))));



  create policy "Members can select"
  on "public"."workspaces_reddit_comments"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces_reddit_comments.workspace)))));



  create policy "Members can update"
  on "public"."workspaces_reddit_comments"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces_reddit_comments.workspace)))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces_reddit_comments.workspace)))));



  create policy "Members can insert"
  on "public"."workspaces_reddit_posts"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces_reddit_posts.workspace)))));



  create policy "Members can select"
  on "public"."workspaces_reddit_posts"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces_reddit_posts.workspace)))));



  create policy "Members can update"
  on "public"."workspaces_reddit_posts"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces_reddit_posts.workspace)))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces_reddit_posts.workspace)))));



  create policy "Members can all"
  on "public"."workspaces_subreddits"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces_subreddits.workspace)))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = ( SELECT auth.uid() AS uid)) AND (p.workspace = workspaces_subreddits.workspace)))));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


