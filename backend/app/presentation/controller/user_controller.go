package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/bayamasa/go-boilerplate/app/application"
)

type UserController struct {
	FetchUserUsecase  *application.FetchUserUsecase
	CreateUserUsecase *application.CreateUserUsecase
}

func NewUserController(fetchUsecase *application.FetchUserUsecase, createUsecase *application.CreateUserUsecase) *UserController {
	return &UserController{
		FetchUserUsecase:  fetchUsecase,
		CreateUserUsecase: createUsecase,
	}
}

func (uc *UserController) GetUsers(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		fmt.Printf("error: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	input := application.FetchUserInput{
		UserId: id,
	}
	users, err := uc.FetchUserUsecase.FetchUser(ctx, input)
	if err != nil {
		fmt.Printf("error: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

type CreateUserRequest struct {
	Email       string    `json:"email"`
	LastName    string    `json:"last_name"`
	FirstName   string    `json:"first_name"`
	Gender      string    `json:"gender"`
	DateOfBirth time.Time `json:"date_of_birth"`
	Location    string    `json:"location"`
}

func (uc *UserController) CreateUsers(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Printf("error: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	input := application.CreateUserInput{
		Email:       req.Email,
		LastName:    req.LastName,
		FirstName:   req.FirstName,
		Gender:      req.Gender,
		DateOfBirth: req.DateOfBirth,
		Location:    req.Location,
	}

	if err := uc.CreateUserUsecase.Execute(ctx, input); err != nil {
		fmt.Printf("error: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "created"})
}
