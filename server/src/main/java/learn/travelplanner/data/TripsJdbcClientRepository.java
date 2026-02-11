package learn.travelplanner.data;

import learn.travelplanner.data.mappers.TripMapper;
import learn.travelplanner.data.mappers.UserMapper;
import learn.travelplanner.models.Trip;
import org.springframework.jdbc.core.simple.JdbcClient;

import java.util.List;

public class TripsJdbcClientRepository implements TripsRepository{
    private final JdbcClient jdbcClient;

    public TripsJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }


    @Override
    public List<Trip> findTemplates() {
        final String sql = """
                SELECT trip_id, country, city, start_date, end_date, notes, owner_user_id, is_template 
                FROM trip
                where is_template = true;
                """;

        return jdbcClient.sql(sql)
                .query(new TripMapper())
                .list();

    }
}
