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
	userController := controller.NewUserController(*fetchUserUseCase)
	mux.HandleFunc("GET /users/{id}", userController.GetUsers)

	return mux
}
