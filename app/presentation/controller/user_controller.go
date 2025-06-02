package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/bayamasa/go-boilerplate/app/application"
)

type UserController struct {
	application.FetchUserUsecase
}

func NewUserController(usecase application.FetchUserUsecase) *UserController {
	return &UserController{
		FetchUserUsecase: usecase,
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
