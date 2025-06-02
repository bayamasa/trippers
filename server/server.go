package server

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/bayamasa/go-boilerplate/app/infrastructure/client/db"
	"golang.org/x/sync/errgroup"
)

const (
	readTimeoutDefaultSec = 5
)

type Server struct {
	http.Server
}

func NewServer(port string, db *db.DB) *Server {

	return &Server{
		http.Server{
			Addr:        ":" + port,
			Handler:     NewMux(db),
			ReadTimeout: readTimeout(),
		}}
}

func readTimeout() time.Duration {
	var readTimeout time.Duration
	envReadTimeout := os.Getenv("REQUEST_READ_TIMEOUT")

	readTimeout, err := time.ParseDuration(envReadTimeout)
	if err != nil {
		readTimeout = readTimeoutDefaultSec * time.Second
	}
	return readTimeout
}

func (s *Server) Run() error {

	eg, serveCtx := errgroup.WithContext(context.Background())

	eg.Go(func() error {
		fmt.Printf("Server is running on port %s\n", s.Addr)
		if err := s.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			return err
		}
		return nil
	})

	signalCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	select {
	case <-signalCtx.Done():
		fmt.Println("Signal received")
	case <-serveCtx.Done():
		fmt.Printf("Server error: %v\n", context.Cause(serveCtx))
	}

	ctx, cancel := context.WithTimeoutCause(context.Background(), 5*time.Second, errors.New("context deadline: 5s exceeded"))
	defer cancel()
	if err := s.Shutdown(ctx); err != nil {
		fmt.Printf("failed to gracefully shutdown: %v\n", err)
	}

	eg.Wait()
	return nil
}
