package application

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/bayamasa/go-boilerplate/app/domain/user"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type mockUserRepository struct {
	mock.Mock
}

func (m *mockUserRepository) FindBy(ctx context.Context, id int64) (*user.User, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*user.User), args.Error(1)
}

func (m *mockUserRepository) Create(ctx context.Context, user *user.User) error {
	args := m.Called(ctx, user)
	return args.Error(0)
}

func TestCreateUserUsecase_Execute(t *testing.T) {
	t.Run("successful create", func(t *testing.T) {
		mockRepo := new(mockUserRepository)
		usecase := NewCreateUserUsecase(mockRepo)

		input := CreateUserInput{
			Email:       "test@example.com",
			LastName:    "Test",
			FirstName:   "User",
			Gender:      "male",
			DateOfBirth: time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC),
			Location:    "Tokyo",
		}

		mockRepo.On("Create", mock.Anything, mock.MatchedBy(func(u *user.User) bool {
			return u.Email() == input.Email &&
				u.LastName() == input.LastName &&
				u.FirstName() == input.FirstName &&
				u.Gender() == input.Gender &&
				u.DateOfBirth() == input.DateOfBirth &&
				u.Location() == input.Location
		})).Return(nil)

		err := usecase.Execute(context.Background(), input)
		assert.NoError(t, err)
		mockRepo.AssertExpectations(t)
	})

	t.Run("repository error", func(t *testing.T) {
		mockRepo := new(mockUserRepository)
		usecase := NewCreateUserUsecase(mockRepo)

		input := CreateUserInput{
			Email:       "test@example.com",
			LastName:    "Test",
			FirstName:   "User",
			Gender:      "male",
			DateOfBirth: time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC),
			Location:    "Tokyo",
		}

		expectedErr := errors.New("database error")
		mockRepo.On("Create", mock.Anything, mock.Anything).Return(expectedErr)

		err := usecase.Execute(context.Background(), input)
		assert.Error(t, err)
		assert.Equal(t, expectedErr, err)
		mockRepo.AssertExpectations(t)
	})
}
