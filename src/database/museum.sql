Table museum {
  id int
  name text
  address text
  fee int


}

Ref: "museum"."id" > "city"."id"

Ref: "museum"."id" < "review"."id"



Table user {
  id int [pk, increment]
  full_name text
  password text
  email email
  role user_role
  is_admin boolean
}

Ref: "user"."id" < "review"."id"

enum user_role {
  user
  admin
  guest
}

Table city {
  id int [increment]
  name int
}

Table review {
  id int
}


