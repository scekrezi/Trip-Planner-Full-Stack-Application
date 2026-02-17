package learn.travelplanner.controllers;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import learn.travelplanner.data.TripMemberRepository;
import learn.travelplanner.domain.Result;
import learn.travelplanner.domain.TripMemberService;
import learn.travelplanner.domain.TripService;
import learn.travelplanner.models.Trip;
import learn.travelplanner.models.TripMember;
import learn.travelplanner.models.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/trips/{tripId}/members")
@CrossOrigin
public class TripMemberController {
    private final TripMemberService service;
    private final TripService tripService;
    private final TripMemberRepository tripMemberRepository;


    public TripMemberController(TripMemberService service, TripService tripService, TripMemberRepository tripMemberRepository) {
        this.service = service;
        this.tripService = tripService;

        this.tripMemberRepository = tripMemberRepository;
    }

    @GetMapping
    public ResponseEntity<Object> findMembers(@PathVariable int tripId, @RequestHeader Map<String, String> headers) throws JsonProcessingException {

        User user = getUserFromHeaders(headers);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Result<Trip> tripResult = tripService.findById(tripId);
        if (!tripResult.isSuccess()) {
            return ErrorResponse.build(tripResult);
        }

        Trip trip = tripResult.getPayload();
        boolean isOwner = trip.getOwner() != null && trip.getOwner().getUserId() == user.getUserId();
        boolean isCollaborator = tripMemberRepository.isMember(tripId, user.getUserId());

        if (!isOwner && !isCollaborator) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Result<List<TripMember>> result = service.findMembers(tripId);
        if (!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> addMember(@PathVariable int tripId,
                                            @RequestBody TripMember request,
                                            @RequestHeader Map<String, String> headers)
            throws JsonProcessingException {

        User user = getUserFromHeaders(headers);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Result<Trip> tripResult = tripService.findById(tripId);
        if (!tripResult.isSuccess()) {
            return ErrorResponse.build(tripResult);
        }

        Trip trip = tripResult.getPayload();
        boolean isOwner = trip.getOwner() != null && trip.getOwner().getUserId() == user.getUserId();

        if (!isOwner) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Result<TripMember> result = service.addMember(tripId, request.getUser().getEmail(), request.getRole());
        if (!result.isSuccess()) {
            return ErrorResponse.build(result);
        }

        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }




    private User getUserFromHeaders(Map<String, String> headers) throws JsonProcessingException {
        String diyJwt = headers.get("authorization");
        if (diyJwt == null) {
            return null;
        } else {
            String userData = diyJwt.split("\\|")[0];
            int signature = Integer.parseInt(diyJwt.split("\\|")[1]);
            int reComputedSignature = Objects.hash(userData + "backend-secret");
            if (signature == reComputedSignature) {
                ObjectMapper jsonReader = new ObjectMapper();
                return jsonReader.readValue(userData, User.class);

            } else {
                return null;
            }
        }
    }
}
