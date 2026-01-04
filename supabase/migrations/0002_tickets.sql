create type "public"."ticket_status" as enum ('pending', 'in_progress', 'resolved');

drop policy "Everyone can insert" on "public"."subreddits";


  create table "public"."feedback_tickets" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "user_id" uuid not null,
    "email" text not null,
    "category" text not null,
    "rating" smallint not null default '0'::smallint,
    "feedback" text not null,
    "status" public.ticket_status not null default 'pending'::public.ticket_status
      );


alter table "public"."feedback_tickets" enable row level security;


  create table "public"."support_tickets" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "user_id" uuid not null,
    "email" text not null,
    "category" text not null,
    "description" text not null,
    "steps" text,
    "status" public.ticket_status not null default 'pending'::public.ticket_status
      );


alter table "public"."support_tickets" enable row level security;


  create table "public"."ticket_rate_limits" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "ticket_type" text not null
      );


alter table "public"."ticket_rate_limits" enable row level security;

alter table "public"."reddit_posts" drop column "reply";

CREATE UNIQUE INDEX feedback_tickets_pkey ON public.feedback_tickets USING btree (id);

CREATE UNIQUE INDEX support_tickets_pkey ON public.support_tickets USING btree (id);

CREATE UNIQUE INDEX ticket_rate_limits_pkey ON public.ticket_rate_limits USING btree (id);

alter table "public"."feedback_tickets" add constraint "feedback_tickets_pkey" PRIMARY KEY using index "feedback_tickets_pkey";

alter table "public"."support_tickets" add constraint "support_tickets_pkey" PRIMARY KEY using index "support_tickets_pkey";

alter table "public"."ticket_rate_limits" add constraint "ticket_rate_limits_pkey" PRIMARY KEY using index "ticket_rate_limits_pkey";

alter table "public"."feedback_tickets" add constraint "feedback_tickets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feedback_tickets" validate constraint "feedback_tickets_user_id_fkey";

alter table "public"."support_tickets" add constraint "support_tickets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_user_id_fkey";

alter table "public"."ticket_rate_limits" add constraint "ticket_rate_limits_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ticket_rate_limits" validate constraint "ticket_rate_limits_user_id_fkey";

grant delete on table "public"."feedback_tickets" to "anon";

grant insert on table "public"."feedback_tickets" to "anon";

grant references on table "public"."feedback_tickets" to "anon";

grant select on table "public"."feedback_tickets" to "anon";

grant trigger on table "public"."feedback_tickets" to "anon";

grant truncate on table "public"."feedback_tickets" to "anon";

grant update on table "public"."feedback_tickets" to "anon";

grant delete on table "public"."feedback_tickets" to "authenticated";

grant insert on table "public"."feedback_tickets" to "authenticated";

grant references on table "public"."feedback_tickets" to "authenticated";

grant select on table "public"."feedback_tickets" to "authenticated";

grant trigger on table "public"."feedback_tickets" to "authenticated";

grant truncate on table "public"."feedback_tickets" to "authenticated";

grant update on table "public"."feedback_tickets" to "authenticated";

grant delete on table "public"."feedback_tickets" to "service_role";

grant insert on table "public"."feedback_tickets" to "service_role";

grant references on table "public"."feedback_tickets" to "service_role";

grant select on table "public"."feedback_tickets" to "service_role";

grant trigger on table "public"."feedback_tickets" to "service_role";

grant truncate on table "public"."feedback_tickets" to "service_role";

grant update on table "public"."feedback_tickets" to "service_role";

grant delete on table "public"."support_tickets" to "anon";

grant insert on table "public"."support_tickets" to "anon";

grant references on table "public"."support_tickets" to "anon";

grant select on table "public"."support_tickets" to "anon";

grant trigger on table "public"."support_tickets" to "anon";

grant truncate on table "public"."support_tickets" to "anon";

grant update on table "public"."support_tickets" to "anon";

grant delete on table "public"."support_tickets" to "authenticated";

grant insert on table "public"."support_tickets" to "authenticated";

grant references on table "public"."support_tickets" to "authenticated";

grant select on table "public"."support_tickets" to "authenticated";

grant trigger on table "public"."support_tickets" to "authenticated";

grant truncate on table "public"."support_tickets" to "authenticated";

grant update on table "public"."support_tickets" to "authenticated";

grant delete on table "public"."support_tickets" to "service_role";

grant insert on table "public"."support_tickets" to "service_role";

grant references on table "public"."support_tickets" to "service_role";

grant select on table "public"."support_tickets" to "service_role";

grant trigger on table "public"."support_tickets" to "service_role";

grant truncate on table "public"."support_tickets" to "service_role";

grant update on table "public"."support_tickets" to "service_role";

grant delete on table "public"."ticket_rate_limits" to "anon";

grant insert on table "public"."ticket_rate_limits" to "anon";

grant references on table "public"."ticket_rate_limits" to "anon";

grant select on table "public"."ticket_rate_limits" to "anon";

grant trigger on table "public"."ticket_rate_limits" to "anon";

grant truncate on table "public"."ticket_rate_limits" to "anon";

grant update on table "public"."ticket_rate_limits" to "anon";

grant delete on table "public"."ticket_rate_limits" to "authenticated";

grant insert on table "public"."ticket_rate_limits" to "authenticated";

grant references on table "public"."ticket_rate_limits" to "authenticated";

grant select on table "public"."ticket_rate_limits" to "authenticated";

grant trigger on table "public"."ticket_rate_limits" to "authenticated";

grant truncate on table "public"."ticket_rate_limits" to "authenticated";

grant update on table "public"."ticket_rate_limits" to "authenticated";

grant delete on table "public"."ticket_rate_limits" to "service_role";

grant insert on table "public"."ticket_rate_limits" to "service_role";

grant references on table "public"."ticket_rate_limits" to "service_role";

grant select on table "public"."ticket_rate_limits" to "service_role";

grant trigger on table "public"."ticket_rate_limits" to "service_role";

grant truncate on table "public"."ticket_rate_limits" to "service_role";

grant update on table "public"."ticket_rate_limits" to "service_role";


  create policy "Anyone can create"
  on "public"."feedback_tickets"
  as permissive
  for insert
  to authenticated
with check ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Enable select for users based on user_id"
  on "public"."feedback_tickets"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Everyone can edit"
  on "public"."subreddits"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Anyone can create"
  on "public"."support_tickets"
  as permissive
  for insert
  to authenticated
with check ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Enable select for users based on user_id"
  on "public"."support_tickets"
  as permissive
  for select
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Everyone can insert"
  on "public"."subreddits"
  as permissive
  for insert
  to authenticated
with check (true);



