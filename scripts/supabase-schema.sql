-- 在 Supabase SQL Editor 執行此腳本建立 contact_requests 表

create table if not exists contact_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  requirements text not null,
  created_at timestamptz default now()
);

-- 允許匿名插入（表單提交）
alter table contact_requests enable row level security;

create policy "Allow anonymous insert"
  on contact_requests
  for insert
  to anon
  with check (true);

-- 僅允許已驗證使用者讀取（可依需求調整）
create policy "Allow authenticated read"
  on contact_requests
  for select
  to authenticated
  using (true);
