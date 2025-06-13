package server

import (
	"net/http"

	"github.com/bayamasa/go-boilerplate/app/application"
	"github.com/bayamasa/go-boilerplate/app/infrastructure"
	"github.com/bayamasa/go-boilerplate/app/infrastructure/client/db"
	"github.com/bayamasa/go-boilerplate/app/presentation/controller"
)

func NewMux(db *db.DB) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	userRepository := infrastructure.NewMySQLUsersRepository(db)
	fetchUserUseCase := application.NewFetchUsersUsecase(userRepository)
	createUserUseCase := application.NewCreateUserUsecase(userRepository)
	userController := controller.NewUserController(fetchUserUseCase, createUserUseCase)
	mux.HandleFunc("GET /users/{id}", userController.GetUsers)
	mux.HandleFunc("POST /users", userController.CreateUsers)

	return mux
}
