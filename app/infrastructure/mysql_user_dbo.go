package infrastructure

import (
	"time"

	"github.com/bayamasa/go-boilerplate/app/domain/user"
)

type UserDBO struct {
	Id          int
	Email       string
	LastName    string
	FirstName   string
	Gender      string
	DateOfBirth time.Time
	Location    string
}

func (u *UserDBO) ToDomainModel() *user.User {
	return user.NewUser(
		u.Id,
		u.Email,
		u.LastName,
		u.FirstName,
		u.Gender,
		u.DateOfBirth,
		u.Location,
	)
}
