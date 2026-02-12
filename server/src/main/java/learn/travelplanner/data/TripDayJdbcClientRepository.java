package learn.travelplanner.data;

import learn.travelplanner.data.mappers.TripDayMapper;
import learn.travelplanner.models.TripDay;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TripDayJdbcClientRepository implements TripDayRepository{
    private final JdbcClient jdbcClient;

    public TripDayJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }


    @Override
    public List<TripDay> findByTripId(int tripId) throws DataAccessException {
        final String sql = """
                SELECT trip_day_id, day_date, day_notes, trip_id
                from trip_day
                where trip_id = ?
                order by day_date;
                """;

        return jdbcClient.sql(sql)
                .param(tripId)
                .query(new TripDayMapper())
                .list();
    }
}
