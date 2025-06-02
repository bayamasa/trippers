package config

import (
	"fmt"

	"github.com/caarlos0/env/v11"
)

type Config struct {
	Env      string `env:"ENV" envDefault:"local"`
	Database struct {
		Name string `env:"DB_NAME"`
		Host struct {
			Read  string `env:"DB_READ_HOST"`
			Write string `env:"DB_WRITE_HOST"`
		}
		Port     string `env:"DB_PORT"`
		User     string `env:"DB_USER"`
		Password string `env:"DB_PASSWORD"`
	}
}

func NewConfig() (*Config, error) {
	var cfg Config

	if err := env.Parse(&cfg); err != nil {
		return nil, fmt.Errorf("failed to parse config: %w", err)
	}

	return &cfg, nil
}
