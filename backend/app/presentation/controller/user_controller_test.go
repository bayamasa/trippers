package controller

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/bayamasa/go-boilerplate/app/application"
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

func TestUserController_CreateUsers(t *testing.T) {
	t.Run("successful create", func(t *testing.T) {
		mockRepo := new(mockUserRepository)
		fetchUsecase := application.NewFetchUsersUsecase(mockRepo)
		createUsecase := application.NewCreateUserUsecase(mockRepo)
		controller := NewUserController(fetchUsecase, createUsecase)

		reqBody := CreateUserRequest{
			Email:       "test@example.com",
			LastName:    "Test",
			FirstName:   "User",
			Gender:      "male",
			DateOfBirth: time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC),
			Location:    "Tokyo",
		}

		body, _ := json.Marshal(reqBody)
		req := httptest.NewRequest(http.MethodPost, "/users", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		mockRepo.On("Create", mock.Anything, mock.MatchedBy(func(u *user.User) bool {
			return u.Email() == reqBody.Email &&
				u.LastName() == reqBody.LastName &&
				u.FirstName() == reqBody.FirstName &&
				u.Gender() == reqBody.Gender &&
				u.DateOfBirth() == reqBody.DateOfBirth &&
				u.Location() == reqBody.Location
		})).Return(nil)

		controller.CreateUsers(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)

		var response map[string]string
		json.Unmarshal(w.Body.Bytes(), &response)
		assert.Equal(t, "created", response["status"])

		mockRepo.AssertExpectations(t)
	})

	t.Run("invalid json", func(t *testing.T) {
		mockRepo := new(mockUserRepository)
		fetchUsecase := application.NewFetchUsersUsecase(mockRepo)
		createUsecase := application.NewCreateUserUsecase(mockRepo)
		controller := NewUserController(fetchUsecase, createUsecase)

		req := httptest.NewRequest(http.MethodPost, "/users", bytes.NewBufferString("invalid json"))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		controller.CreateUsers(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("usecase error", func(t *testing.T) {
		mockRepo := new(mockUserRepository)
		fetchUsecase := application.NewFetchUsersUsecase(mockRepo)
		createUsecase := application.NewCreateUserUsecase(mockRepo)
		controller := NewUserController(fetchUsecase, createUsecase)

		reqBody := CreateUserRequest{
			Email:       "test@example.com",
			LastName:    "Test",
			FirstName:   "User",
			Gender:      "male",
			DateOfBirth: time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC),
			Location:    "Tokyo",
		}

		body, _ := json.Marshal(reqBody)
		req := httptest.NewRequest(http.MethodPost, "/users", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		mockRepo.On("Create", mock.Anything, mock.Anything).Return(errors.New("database error"))

		controller.CreateUsers(w, req)

		assert.Equal(t, http.StatusInternalServerError, w.Code)
		mockRepo.AssertExpectations(t)
	})
}

func TestUserController_GetUsers(t *testing.T) {
	t.Run("successful get", func(t *testing.T) {
		mockRepo := new(mockUserRepository)
		fetchUsecase := application.NewFetchUsersUsecase(mockRepo)
		createUsecase := application.NewCreateUserUsecase(mockRepo)
		controller := NewUserController(fetchUsecase, createUsecase)

		expectedUser := user.NewUser(
			1,
			"test@example.com",
			"Test",
			"User",
			"male",
			time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC),
			"Tokyo",
		)

		req := httptest.NewRequest(http.MethodGet, "/users/1", nil)
		req.SetPathValue("id", "1")
		w := httptest.NewRecorder()

		mockRepo.On("FindBy", mock.Anything, int64(1)).Return(expectedUser, nil)

		controller.GetUsers(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Header().Get("Content-Type"), "application/json")
		mockRepo.AssertExpectations(t)
	})
}
