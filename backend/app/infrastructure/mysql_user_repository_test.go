package infrastructure

import (
	"context"
	"database/sql"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/bayamasa/go-boilerplate/app/domain/user"
	"github.com/bayamasa/go-boilerplate/app/infrastructure/client/db"
	"github.com/stretchr/testify/assert"
)

func TestMySQLUserRepository_Create(t *testing.T) {
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	database := &db.DB{
		Write: mockDB,
		Read:  mockDB,
	}
	repo := NewMySQLUsersRepository(database)

	testUser := user.NewUser(
		0,
		"test@example.com",
		"Test",
		"User",
		"male",
		time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC),
		"Tokyo",
	)

	t.Run("successful create", func(t *testing.T) {
		query := `INSERT INTO users \(
		email,
		last_name,
		first_name,
		gender,
		date_of_birth,
		location
	\) VALUES \(\?, \?, \?, \?, \?, \?\)`
		
		mock.ExpectExec(query).
			WithArgs(
				testUser.Email(),
				testUser.LastName(),
				testUser.FirstName(),
				testUser.Gender(),
				testUser.DateOfBirth(),
				testUser.Location(),
			).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.Create(context.Background(), testUser)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("database error", func(t *testing.T) {
		query := `INSERT INTO users \(
		email,
		last_name,
		first_name,
		gender,
		date_of_birth,
		location
	\) VALUES \(\?, \?, \?, \?, \?, \?\)`
		
		mock.ExpectExec(query).
			WithArgs(
				testUser.Email(),
				testUser.LastName(),
				testUser.FirstName(),
				testUser.Gender(),
				testUser.DateOfBirth(),
				testUser.Location(),
			).
			WillReturnError(sql.ErrConnDone)

		err := repo.Create(context.Background(), testUser)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "failed to create user")
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestMySQLUserRepository_FindBy(t *testing.T) {
	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	database := &db.DB{
		Write: mockDB,
		Read:  mockDB,
	}
	repo := NewMySQLUsersRepository(database)

	t.Run("successful find", func(t *testing.T) {
		expectedUser := UserDBO{
			Id:          1,
			Email:       "test@example.com",
			LastName:    "Test",
			FirstName:   "User",
			Gender:      "male",
			DateOfBirth: time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC),
			Location:    "Tokyo",
		}

		query := regexp.QuoteMeta(`SELECT id, email, last_name, first_name, gender, date_of_birth, location FROM users WHERE id = ?`)
		rows := sqlmock.NewRows([]string{"id", "email", "last_name", "first_name", "gender", "date_of_birth", "location"}).
			AddRow(expectedUser.Id, expectedUser.Email, expectedUser.LastName, expectedUser.FirstName, expectedUser.Gender, expectedUser.DateOfBirth, expectedUser.Location)

		mock.ExpectQuery(query).WithArgs(int64(1)).WillReturnRows(rows)

		result, err := repo.FindBy(context.Background(), 1)
		assert.NoError(t, err)
		assert.NotNil(t, result)
		assert.Equal(t, expectedUser.Id, result.Id())
		assert.Equal(t, expectedUser.Email, result.Email())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("user not found", func(t *testing.T) {
		query := regexp.QuoteMeta(`SELECT id, email, last_name, first_name, gender, date_of_birth, location FROM users WHERE id = ?`)
		mock.ExpectQuery(query).WithArgs(int64(999)).WillReturnError(sql.ErrNoRows)

		result, err := repo.FindBy(context.Background(), 999)
		assert.NoError(t, err)
		assert.Nil(t, result)
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}