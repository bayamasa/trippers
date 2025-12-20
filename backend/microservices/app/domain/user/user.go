package user

import "time"

type User struct {
	id          int
	email       string
	lastName    string
	firstName   string
	gender      string
	dateOfBirth time.Time
	location    string
}

func (u *User) Id() int {
	return u.id
}

func (u *User) Email() string {
	return u.email
}

func (u *User) LastName() string {
	return u.lastName
}

func (u *User) FirstName() string {
	return u.firstName
}

func (u *User) Gender() string {
	return u.gender
}

func (u *User) DateOfBirth() time.Time {
	return u.dateOfBirth
}

func (u *User) Location() string {
	return u.location
}

func NewUser(
	id int,
	email string,
	lastName string,
	firstName string,
	gender string,
	dateOfBirth time.Time,
	location string,
) *User {
	return &User{
		id:          id,
		email:       email,
		lastName:    lastName,
		firstName:   firstName,
		gender:      gender,
		dateOfBirth: dateOfBirth,
		location:    location,
	}
}
