package infrastructure

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/bayamasa/go-boilerplate/app/domain/user"
	"github.com/bayamasa/go-boilerplate/app/infrastructure/client/db"
)

type MySQLUserRepository struct {
	db *db.DB
}

func NewMySQLUsersRepository(db *db.DB) user.UserRepository {
	return &MySQLUserRepository{
		db: db,
	}
}

func (r *MySQLUserRepository) FindBy(ctx context.Context, id int64) (*user.User, error) {
	query := `
	SELECT 
		id, 
		email,
		last_name,
		first_name,
		gender,
		date_of_birth,
		location
	FROM 
		users 
	WHERE 
		id = ?`

	var dbo UserDBO
	if err := r.db.Read.QueryRowContext(ctx, query, id).Scan(
		&dbo.Id,
		&dbo.Email,
		&dbo.LastName,
		&dbo.FirstName,
		&dbo.Gender,
		&dbo.DateOfBirth,
		&dbo.Location,
	); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}
	return dbo.ToDomainModel(), nil
}
