package main

import (
	"fmt"

	"github.com/bayamasa/go-boilerplate/app/infrastructure/client/db"
	"github.com/bayamasa/go-boilerplate/config"
	"github.com/bayamasa/go-boilerplate/server"
)

func main() {
	config, err := config.NewConfig()
	if err != nil {
		fmt.Println(err)
	}

	db, err := db.NewDB(config)
	if err != nil {
		fmt.Println(err)
	}

	err = db.Ping()
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	s := server.NewServer("8080", db)
	if err := s.Run(); err != nil {
		fmt.Println(err)
	}

}
