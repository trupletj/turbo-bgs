create table "public"."alba" (
    "id" uuid not null,
    "bteg_id" text not null,
    "sub_title" text,
    "organization_id" text,
    "name" text,
    "description" text,
    "gazar_id" text,
    "heltes_id" text,
    "is_active" boolean not null,
    "created_at" timestamp with time zone not null,
    "updated_at" timestamp with time zone
);


create table "public"."gazar" (
    "id" uuid not null,
    "bteg_id" text not null,
    "created_at" timestamp with time zone not null,
    "updated_at" timestamp with time zone,
    "is_active" boolean not null,
    "organization_id" text not null
);


create table "public"."heltes" (
    "id" uuid not null,
    "bteg_id" text not null,
    "sub_title" text,
    "organization_id" text,
    "gazar_id" text,
    "description" text,
    "name" text,
    "is_active" boolean not null,
    "updated_at" timestamp with time zone,
    "created_at" timestamp with time zone
);


create table "public"."job_position" (
    "id" uuid not null,
    "bteg_id" text,
    "gazar_id" text,
    "alba_id" text,
    "heltes_id" text,
    "organization_id" text,
    "name" text,
    "description" text,
    "created_at" timestamp with time zone not null,
    "is_active" boolean
);


create table "public"."organization" (
    "id" uuid not null,
    "bteg_id" text not null,
    "name" text not null,
    "sub_title" text,
    "is_hr" boolean not null,
    "is_active" boolean,
    "description" text,
    "created_at" timestamp with time zone not null
);


create table "public"."user" (
    "id" uuid not null default gen_random_uuid(),
    "bteg_id" text not null,
    "email" text,
    "phone" text,
    "idcard_number" text,
    "is_active" boolean,
    "address" text,
    "register_number" text,
    "gazar_id" text,
    "alba_id" text,
    "heltes_id" text,
    "job_position_id" text,
    "nice_name" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "first_name" text,
    "last_name" text,
    "organization_id" text,
    "sms_code" text,
    "sms_active" timestamp with time zone
);


CREATE UNIQUE INDEX alba_bteg_id_key ON public.alba USING btree (bteg_id);

CREATE INDEX alba_gazar_id_idx ON public.alba USING btree (gazar_id);

CREATE INDEX alba_heltes_id_idx ON public.alba USING btree (heltes_id);

CREATE INDEX alba_org_id_idx ON public.alba USING btree (organization_id);

CREATE UNIQUE INDEX alba_pkey ON public.alba USING btree (id);

CREATE UNIQUE INDEX gazar_bteg_id_key ON public.gazar USING btree (bteg_id);

CREATE INDEX gazar_org_id_idx ON public.gazar USING btree (organization_id);

CREATE UNIQUE INDEX gazar_pkey ON public.gazar USING btree (id);

CREATE UNIQUE INDEX heltes_bteg_id_key ON public.heltes USING btree (bteg_id);

CREATE INDEX heltes_gazar_id_idx ON public.heltes USING btree (gazar_id);

CREATE INDEX heltes_org_id_idx ON public.heltes USING btree (organization_id);

CREATE UNIQUE INDEX heltes_pkey ON public.heltes USING btree (id);

CREATE INDEX job_position_alba_id_idx ON public.job_position USING btree (alba_id);

CREATE UNIQUE INDEX job_position_bteg_id_key ON public.job_position USING btree (bteg_id);

CREATE INDEX job_position_gazar_id_idx ON public.job_position USING btree (gazar_id);

CREATE INDEX job_position_heltes_id_idx ON public.job_position USING btree (heltes_id);

CREATE INDEX job_position_org_id_idx ON public.job_position USING btree (organization_id);

CREATE UNIQUE INDEX job_position_pkey ON public.job_position USING btree (id);

CREATE UNIQUE INDEX organization_bteg_id_key ON public.organization USING btree (bteg_id);

CREATE UNIQUE INDEX organization_pkey ON public.organization USING btree (id);

CREATE INDEX user_alba_id_idx ON public."user" USING btree (alba_id);

CREATE UNIQUE INDEX user_bteg_id_key ON public."user" USING btree (bteg_id);

CREATE INDEX user_gazar_id_idx ON public."user" USING btree (gazar_id);

CREATE INDEX user_heltes_id_idx ON public."user" USING btree (heltes_id);

CREATE INDEX user_job_position_id_idx ON public."user" USING btree (job_position_id);

CREATE INDEX user_organization_id_idx ON public."user" USING btree (organization_id);

CREATE UNIQUE INDEX user_pkey ON public."user" USING btree (id);

CREATE UNIQUE INDEX user_register_number_key ON public."user" USING btree (register_number);

alter table "public"."alba" add constraint "alba_pkey" PRIMARY KEY using index "alba_pkey";

alter table "public"."gazar" add constraint "gazar_pkey" PRIMARY KEY using index "gazar_pkey";

alter table "public"."heltes" add constraint "heltes_pkey" PRIMARY KEY using index "heltes_pkey";

alter table "public"."job_position" add constraint "job_position_pkey" PRIMARY KEY using index "job_position_pkey";

alter table "public"."organization" add constraint "organization_pkey" PRIMARY KEY using index "organization_pkey";

alter table "public"."user" add constraint "user_pkey" PRIMARY KEY using index "user_pkey";

alter table "public"."alba" add constraint "alba_bteg_id_key" UNIQUE using index "alba_bteg_id_key";

alter table "public"."alba" add constraint "alba_gazar_fk" FOREIGN KEY (gazar_id) REFERENCES gazar(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."alba" validate constraint "alba_gazar_fk";

alter table "public"."alba" add constraint "alba_heltes_fk" FOREIGN KEY (heltes_id) REFERENCES heltes(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."alba" validate constraint "alba_heltes_fk";

alter table "public"."alba" add constraint "alba_organization_fk" FOREIGN KEY (organization_id) REFERENCES organization(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."alba" validate constraint "alba_organization_fk";

alter table "public"."gazar" add constraint "gazar_bteg_id_key" UNIQUE using index "gazar_bteg_id_key";

alter table "public"."gazar" add constraint "gazar_organization_fk" FOREIGN KEY (organization_id) REFERENCES organization(bteg_id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."gazar" validate constraint "gazar_organization_fk";

alter table "public"."heltes" add constraint "heltes_bteg_id_key" UNIQUE using index "heltes_bteg_id_key";

alter table "public"."heltes" add constraint "heltes_gazar_fk" FOREIGN KEY (gazar_id) REFERENCES gazar(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."heltes" validate constraint "heltes_gazar_fk";

alter table "public"."heltes" add constraint "heltes_organization_fk" FOREIGN KEY (organization_id) REFERENCES organization(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."heltes" validate constraint "heltes_organization_fk";

alter table "public"."job_position" add constraint "job_position_alba_fk" FOREIGN KEY (alba_id) REFERENCES alba(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."job_position" validate constraint "job_position_alba_fk";

alter table "public"."job_position" add constraint "job_position_bteg_id_key" UNIQUE using index "job_position_bteg_id_key";

alter table "public"."job_position" add constraint "job_position_gazar_fk" FOREIGN KEY (gazar_id) REFERENCES gazar(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."job_position" validate constraint "job_position_gazar_fk";

alter table "public"."job_position" add constraint "job_position_heltes_fk" FOREIGN KEY (heltes_id) REFERENCES heltes(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."job_position" validate constraint "job_position_heltes_fk";

alter table "public"."job_position" add constraint "job_position_org_fk" FOREIGN KEY (organization_id) REFERENCES organization(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."job_position" validate constraint "job_position_org_fk";

alter table "public"."organization" add constraint "organization_bteg_id_key" UNIQUE using index "organization_bteg_id_key";

alter table "public"."user" add constraint "user_alba_fk" FOREIGN KEY (alba_id) REFERENCES alba(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."user" validate constraint "user_alba_fk";

alter table "public"."user" add constraint "user_bteg_id_key" UNIQUE using index "user_bteg_id_key";

alter table "public"."user" add constraint "user_gazar_fk" FOREIGN KEY (gazar_id) REFERENCES gazar(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."user" validate constraint "user_gazar_fk";

alter table "public"."user" add constraint "user_heltes_fk" FOREIGN KEY (heltes_id) REFERENCES heltes(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."user" validate constraint "user_heltes_fk";

alter table "public"."user" add constraint "user_job_position_fk" FOREIGN KEY (job_position_id) REFERENCES job_position(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."user" validate constraint "user_job_position_fk";

alter table "public"."user" add constraint "user_organization_fk" FOREIGN KEY (organization_id) REFERENCES organization(bteg_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."user" validate constraint "user_organization_fk";

alter table "public"."user" add constraint "user_register_number_key" UNIQUE using index "user_register_number_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at := now();
  return new;
end$function$
;

grant delete on table "public"."alba" to "anon";

grant insert on table "public"."alba" to "anon";

grant references on table "public"."alba" to "anon";

grant select on table "public"."alba" to "anon";

grant trigger on table "public"."alba" to "anon";

grant truncate on table "public"."alba" to "anon";

grant update on table "public"."alba" to "anon";

grant delete on table "public"."alba" to "authenticated";

grant insert on table "public"."alba" to "authenticated";

grant references on table "public"."alba" to "authenticated";

grant select on table "public"."alba" to "authenticated";

grant trigger on table "public"."alba" to "authenticated";

grant truncate on table "public"."alba" to "authenticated";

grant update on table "public"."alba" to "authenticated";

grant delete on table "public"."alba" to "service_role";

grant insert on table "public"."alba" to "service_role";

grant references on table "public"."alba" to "service_role";

grant select on table "public"."alba" to "service_role";

grant trigger on table "public"."alba" to "service_role";

grant truncate on table "public"."alba" to "service_role";

grant update on table "public"."alba" to "service_role";

grant delete on table "public"."gazar" to "anon";

grant insert on table "public"."gazar" to "anon";

grant references on table "public"."gazar" to "anon";

grant select on table "public"."gazar" to "anon";

grant trigger on table "public"."gazar" to "anon";

grant truncate on table "public"."gazar" to "anon";

grant update on table "public"."gazar" to "anon";

grant delete on table "public"."gazar" to "authenticated";

grant insert on table "public"."gazar" to "authenticated";

grant references on table "public"."gazar" to "authenticated";

grant select on table "public"."gazar" to "authenticated";

grant trigger on table "public"."gazar" to "authenticated";

grant truncate on table "public"."gazar" to "authenticated";

grant update on table "public"."gazar" to "authenticated";

grant delete on table "public"."gazar" to "service_role";

grant insert on table "public"."gazar" to "service_role";

grant references on table "public"."gazar" to "service_role";

grant select on table "public"."gazar" to "service_role";

grant trigger on table "public"."gazar" to "service_role";

grant truncate on table "public"."gazar" to "service_role";

grant update on table "public"."gazar" to "service_role";

grant delete on table "public"."heltes" to "anon";

grant insert on table "public"."heltes" to "anon";

grant references on table "public"."heltes" to "anon";

grant select on table "public"."heltes" to "anon";

grant trigger on table "public"."heltes" to "anon";

grant truncate on table "public"."heltes" to "anon";

grant update on table "public"."heltes" to "anon";

grant delete on table "public"."heltes" to "authenticated";

grant insert on table "public"."heltes" to "authenticated";

grant references on table "public"."heltes" to "authenticated";

grant select on table "public"."heltes" to "authenticated";

grant trigger on table "public"."heltes" to "authenticated";

grant truncate on table "public"."heltes" to "authenticated";

grant update on table "public"."heltes" to "authenticated";

grant delete on table "public"."heltes" to "service_role";

grant insert on table "public"."heltes" to "service_role";

grant references on table "public"."heltes" to "service_role";

grant select on table "public"."heltes" to "service_role";

grant trigger on table "public"."heltes" to "service_role";

grant truncate on table "public"."heltes" to "service_role";

grant update on table "public"."heltes" to "service_role";

grant delete on table "public"."job_position" to "anon";

grant insert on table "public"."job_position" to "anon";

grant references on table "public"."job_position" to "anon";

grant select on table "public"."job_position" to "anon";

grant trigger on table "public"."job_position" to "anon";

grant truncate on table "public"."job_position" to "anon";

grant update on table "public"."job_position" to "anon";

grant delete on table "public"."job_position" to "authenticated";

grant insert on table "public"."job_position" to "authenticated";

grant references on table "public"."job_position" to "authenticated";

grant select on table "public"."job_position" to "authenticated";

grant trigger on table "public"."job_position" to "authenticated";

grant truncate on table "public"."job_position" to "authenticated";

grant update on table "public"."job_position" to "authenticated";

grant delete on table "public"."job_position" to "service_role";

grant insert on table "public"."job_position" to "service_role";

grant references on table "public"."job_position" to "service_role";

grant select on table "public"."job_position" to "service_role";

grant trigger on table "public"."job_position" to "service_role";

grant truncate on table "public"."job_position" to "service_role";

grant update on table "public"."job_position" to "service_role";

grant delete on table "public"."organization" to "anon";

grant insert on table "public"."organization" to "anon";

grant references on table "public"."organization" to "anon";

grant select on table "public"."organization" to "anon";

grant trigger on table "public"."organization" to "anon";

grant truncate on table "public"."organization" to "anon";

grant update on table "public"."organization" to "anon";

grant delete on table "public"."organization" to "authenticated";

grant insert on table "public"."organization" to "authenticated";

grant references on table "public"."organization" to "authenticated";

grant select on table "public"."organization" to "authenticated";

grant trigger on table "public"."organization" to "authenticated";

grant truncate on table "public"."organization" to "authenticated";

grant update on table "public"."organization" to "authenticated";

grant delete on table "public"."organization" to "service_role";

grant insert on table "public"."organization" to "service_role";

grant references on table "public"."organization" to "service_role";

grant select on table "public"."organization" to "service_role";

grant trigger on table "public"."organization" to "service_role";

grant truncate on table "public"."organization" to "service_role";

grant update on table "public"."organization" to "service_role";

grant delete on table "public"."user" to "anon";

grant insert on table "public"."user" to "anon";

grant references on table "public"."user" to "anon";

grant select on table "public"."user" to "anon";

grant trigger on table "public"."user" to "anon";

grant truncate on table "public"."user" to "anon";

grant update on table "public"."user" to "anon";

grant delete on table "public"."user" to "authenticated";

grant insert on table "public"."user" to "authenticated";

grant references on table "public"."user" to "authenticated";

grant select on table "public"."user" to "authenticated";

grant trigger on table "public"."user" to "authenticated";

grant truncate on table "public"."user" to "authenticated";

grant update on table "public"."user" to "authenticated";

grant delete on table "public"."user" to "service_role";

grant insert on table "public"."user" to "service_role";

grant references on table "public"."user" to "service_role";

grant select on table "public"."user" to "service_role";

grant trigger on table "public"."user" to "service_role";

grant truncate on table "public"."user" to "service_role";

grant update on table "public"."user" to "service_role";

CREATE TRIGGER set_updated_at_alba BEFORE UPDATE ON public.alba FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_gazar BEFORE UPDATE ON public.gazar FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_heltes BEFORE UPDATE ON public.heltes FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_user BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION set_updated_at();


