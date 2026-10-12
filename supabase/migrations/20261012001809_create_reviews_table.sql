create table reviews (
    id bigint primary key generated always as identity,
    user_id uuid not null references user_profiles (id),
    book_title text not null,
    author text not null,
    genre text not null,
    rating smallint not null check (rating between 1 and 5),
    body text not null,
    created_at timestamptz default now()
);

alter publication supabase_realtime add table reviews;