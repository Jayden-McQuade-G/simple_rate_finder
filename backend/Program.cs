
using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

//Hard coded db connection details
string connectionString =
    "server=localhost;Database=srf_db;User ID=root;Password=root;";

//Used to test database connection is functional
app.MapGet("/test-db", async () =>
{
    try
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        return Results.Ok("Connection successful");
    }
    catch (MySqlException ex)
    {
        return Results.Problem($"MySQL error: {ex.Message}");
    }
    catch (Exception ex)
    {
        return Results.Problem($"General error: {ex.Message}");
    }
})
.WithName("test-db");

//Retrieve all savings accounts for a specific user
app.MapGet("/customer-account/{customerId:int}", async (int customerId) =>
{
    try
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = @"
            SELECT *
            FROM customer_account
            WHERE customer_id = @customerId";

        await using var command = new MySqlCommand(sql, connection);

        command.Parameters.AddWithValue("@customerId", customerId);

        await using var reader = await command.ExecuteReaderAsync();

        var accounts = new List<object>();

        while (await reader.ReadAsync())
        {
            accounts.Add(new
            {
                customerAccountId = reader.GetInt32(reader.GetOrdinal("customer_account_id")),
                marketAccountId = reader.GetInt32(reader.GetOrdinal("market_account_id")),
                customerId = reader.GetInt32(reader.GetOrdinal("customer_id")),
                balance = reader.GetDecimal(reader.GetOrdinal("balance")),
                updatedAt = reader.GetDateTime(reader.GetOrdinal("updated_at"))
            });
        }

        if (accounts.Count == 0)
            return Results.NotFound("No accounts found.");

        return Results.Ok(accounts);
    }
    catch (MySqlException ex)
    {
        return Results.Problem($"MySQL error: {ex.Message}");
    }
    catch (Exception ex)
    {
        return Results.Problem($"General error: {ex.Message}");
    }
})
.WithName("customer-accounts");

//Retrieve all savings accounts for a specific user
app.MapGet("/all-customer-accounts", async () =>
{
    try
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = @"
            SELECT *
            FROM customer_account";

        await using var command = new MySqlCommand(sql, connection);

        await using var reader = await command.ExecuteReaderAsync();

        var accounts = new List<object>();

        while (await reader.ReadAsync())
        {
            accounts.Add(new
            {
                customerId = reader.GetInt32(reader.GetOrdinal("customer_account_id")),
                name = reader.GetInt32(reader.GetOrdinal("name")),
            });
        }
        if (accounts.Count == 0)
            return Results.NotFound("No accounts found.");

        return Results.Ok(accounts);
    }
    catch (MySqlException ex)
    {
        return Results.Problem($"MySQL error: {ex.Message}");
    }
    catch (Exception ex)
    {
        return Results.Problem($"General error: {ex.Message}");
    }
})
.WithName("all-customer-accounts");


//Returns the savings account with the highest interest rate
app.MapGet("/best-savings-account", async () =>
{
    try
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = @"
            SELECT *
            FROM market_account
            ORDER BY interest_rate DESC
            LIMIT 1";

        await using var command = new MySqlCommand(sql, connection);

        await using var reader = await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
            return Results.NotFound("No savings accounts found.");

        var account = new
        {
            marketAccountId = reader.GetInt32(reader.GetOrdinal("market_account_id")),
            accountName = reader.GetString(reader.GetOrdinal("account_name")),
            companyName = reader.GetString(reader.GetOrdinal("company_name")),
            interestRate = reader.GetDecimal(reader.GetOrdinal("interest_rate")),
            updatedAt = reader.GetDateTime(reader.GetOrdinal("updated_at"))
        };

        return Results.Ok(account);
    }
    catch (MySqlException ex)
    {
        return Results.Problem($"MySQL error: {ex.Message}");
    }
    catch (Exception ex)
    {
        return Results.Problem($"General error: {ex.Message}");
    }
})
.WithName("best-savings-account");

// Recieves 2 types of accounts and checks which one has a higher interest rate.
app.MapPost("/compare-accounts", (CompareAccountsRequest request) =>
{
    try
    {
        var accountABetter = request.AccountAInterestRate > request.AccountBInterestRate;

        var betterRate = accountABetter
            ? request.AccountAInterestRate
            : request.AccountBInterestRate;

        var worseRate = accountABetter
            ? request.AccountBInterestRate
            : request.AccountAInterestRate;

        var difference = betterRate - worseRate;

        return Results.Ok(new
        {
            accountABetter,
            difference,
            betterRate
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"General error: {ex.Message}");
    }
})
.WithName("compare-accounts");

//Recieves the updated account details, and inserts them into the database.
app.MapPost("/update-account", async (UpdateAccountRequest account) =>
{
    try
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        const string sql = @"
            UPDATE customer_account
            SET
                market_account_id = @marketAccountId,
                balance = @balance,
                account_name = @accountName
            WHERE customer_account_id = @customerAccountId";

        await using var command = new MySqlCommand(sql, connection);

        command.Parameters.AddWithValue("@customerAccountId", account.CustomerAccountId);
        command.Parameters.AddWithValue("@marketAccountId", account.MarketAccountId);
        command.Parameters.AddWithValue("@balance", account.Balance);
        command.Parameters.AddWithValue("@accountName", account.AccountName);

        var rowsAffected = await command.ExecuteNonQueryAsync();

        if (rowsAffected == 0)
            return Results.NotFound("Account not found.");

        return Results.Ok("Account updated successfully.");
    }
    catch (MySqlException ex)
    {
        return Results.Problem($"MySQL error: {ex.Message}");
    }
    catch (Exception ex)
    {
        return Results.Problem($"General error: {ex.Message}");
    }
})
.WithName("update-account");

app.Run();

public record CompareAccountsRequest(
    decimal AccountAInterestRate,
    decimal AccountBInterestRate
);
public record UpdateAccountRequest(
    int CustomerAccountId,
    int MarketAccountId,
    decimal Balance,
    string AccountName
);
