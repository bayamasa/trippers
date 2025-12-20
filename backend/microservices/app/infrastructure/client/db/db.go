package db

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"time"

	"github.com/bayamasa/go-boilerplate/config"
	_ "github.com/lib/pq"
)

const pingTimeout = 2 * time.Second

type DB struct {
	Read  *sql.DB
	Write *sql.DB
}

func NewDB(c *config.Config) (*DB, error) {
	driverName := "postgres"

	read, err := sql.Open(driverName, buildDSN(c))
	if err != nil {
		return nil, fmt.Errorf("failed to open read db: %w", err)
	}

	write, err := sql.Open(driverName, buildDSN(c))
	if err != nil {
		return nil, fmt.Errorf("failed to open write db: %w", err)
	}

	return &DB{
		Read:  read,
		Write: write,
	}, nil
}

func buildDSN(c *config.Config) string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		c.Database.Host.Read,
		c.Database.Port,
		c.Database.User,
		c.Database.Password,
		c.Database.Name,
	)
}

func (d *DB) Close() {
	if err := d.Read.Close(); err != nil {
		fmt.Fprintln(os.Stderr, "failed to close read db: %w", err)
	}

	if err := d.Write.Close(); err != nil {
		fmt.Fprintln(os.Stderr, "failed to close write db: %w", err)
	}
}

func (d *DB) Ping() error {

	ctx, cancel := context.WithTimeout(context.Background(), pingTimeout)
	defer cancel()

	if err := d.Read.PingContext(ctx); err != nil {
		return fmt.Errorf("failed to ping read db: %w", err)
	}

	if err := d.Write.PingContext(ctx); err != nil {
		return fmt.Errorf("failed to ping write db: %w", err)
	}

	return nil
}
