package learn.travelplanner.data;

import learn.travelplanner.data.mappers.TripMapper;
import learn.travelplanner.data.mappers.UserMapper;
import learn.travelplanner.models.Trip;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TripsJdbcClientRepository implements TripsRepository{
    private final JdbcClient jdbcClient;

    public TripsJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }


    @Override
    public List<Trip> findTemplates() throws DataAccessException{
        final String sql = """
                SELECT trip_id, country, city, start_date, end_date, notes, owner_user_id, is_template 
                FROM trip
                WHERE is_template = true;
                """;

        return jdbcClient.sql(sql)
                .query(new TripMapper())
                .list();

    }

    @Override
    public Trip findById(int tripId) throws DataAccessException {
        final String sql = """
                SELECT trip_id, country, city, start_date, end_date, notes, owner_user_id, is_template
                FROM trip
                WHERE trip_id = ?
                """;
        return jdbcClient.sql(sql)
                .param(tripId)
                .query(new TripMapper())
                .optional().orElse(null);
    }
}
