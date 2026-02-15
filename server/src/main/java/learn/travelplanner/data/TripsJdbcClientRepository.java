package learn.travelplanner.data;

import learn.travelplanner.data.mappers.TripMapper;
import learn.travelplanner.data.mappers.UserMapper;
import learn.travelplanner.models.Trip;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
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

    @Override
    public Trip create(Trip trip) throws DataAccessException {
        final String sql = """
                insert into trip (country, city, start_date, end_date, notes, owner_user_id, is_template)
                values (:country, :city, :start_date, :end_date, :notes, :owner_user_id, :is_template)
                """;
        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows =  jdbcClient.sql(sql)
                .param("country", trip.getCountry())
                .param("city", trip.getCity())
                .param("start_date", trip.getStartDate())
                .param("end_date", trip.getEndDate())
                .param("notes", trip.getNotes())
                .param("owner_user_id", trip.getOwner().getUserId())
                .param("is_template", trip.isTemplate())
                .update(keyHolder);

        if (rows <= 0) {
            return null;
        }

        trip.setTripId(keyHolder.getKey().intValue());
        return trip;



    }

    @Override
    public List<Trip> findByOwnerId(int ownerId) {

        final String sql = """
            SELECT trip_id, country, city, start_date, end_date, notes, owner_user_id, is_template
            FROM trip
            WHERE owner_user_id = :owner_user_id
              AND is_template = false
            ORDER BY start_date DESC
            """;

        return jdbcClient.sql(sql)
                .param("owner_user_id", ownerId)
                .query(new TripMapper())
                .list();
    }


}
