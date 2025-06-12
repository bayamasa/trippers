package user

import "context"

type UserRepository interface {
	FindBy(ctx context.Context, id int64) (*User, error)
	Create(ctx context.Context, user *User) error
}
