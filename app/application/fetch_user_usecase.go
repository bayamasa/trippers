package application

import (
	"context"
	"fmt"

	"github.com/bayamasa/go-boilerplate/app/domain/user"
)

type FetchUserUsecase struct {
	userRepository user.UserRepository
}

type FetchUserInput struct {
	UserId int64
}

type FetchUserOutput struct {
	Id          int    `json:"id"`
	Email       string `json:"email"`
	LastName    string `json:"last_name"`
	FirstName   string `json:"first_name"`
	Gender      string `json:"gender"`
	DateOfBirth string `json:"date_of_birth"`
	Location    string `json:"location"`
}

func NewFetchUsersUsecase(
	userRepository user.UserRepository,
) *FetchUserUsecase {
	return &FetchUserUsecase{
		userRepository: userRepository,
	}
}

func (fu *FetchUserUsecase) FetchUser(ctx context.Context, input FetchUserInput) (*FetchUserOutput, error) {
	fmt.Printf("input user id: %d\n", input.UserId)
	fetchedUser, err := fu.userRepository.FindBy(ctx, input.UserId)
	if err != nil {
		return nil, err
	}

	if fetchedUser == nil {
		return nil, nil
	}

	return &FetchUserOutput{
		Id:          fetchedUser.Id(),
		Email:       fetchedUser.Email(),
		LastName:    fetchedUser.LastName(),
		FirstName:   fetchedUser.FirstName(),
		Gender:      fetchedUser.Gender(),
		DateOfBirth: fetchedUser.DateOfBirth().String(),
		Location:    fetchedUser.Location(),
	}, nil
}
