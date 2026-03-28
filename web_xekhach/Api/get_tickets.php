<?php
include 'connect.php';

$sql = "
SELECT 
    tickets.id AS ticket_id,
    tickets.seat_number,
    tickets.price,
    tickets.created_at,
    users.name AS user_name,

    trips.departure_time,

    routes.departure AS from_location,
    routes.destination AS to_location,

    bus_types.type_name AS bus_type,
    companies.ten_hang AS company_name

FROM tickets
JOIN users ON tickets.user_id = users.id
JOIN trips ON tickets.trip_id = trips.id
JOIN routes ON trips.route_id = routes.id
JOIN buses ON trips.bus_id = buses.id
JOIN bus_types ON buses.bustype_id = bus_types.id
JOIN companies ON buses.company_id = companies.id

ORDER BY tickets.created_at DESC
";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data, JSON_PRETTY_PRINT);
?>