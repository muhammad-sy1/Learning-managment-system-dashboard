export function viewportToPolygon(viewport: google.maps.LatLngBounds) {
    return [
        {
            lat: viewport.getNorthEast().lat(),
            lng: viewport.getSouthWest().lng(),
        },
        {
            lat: viewport.getNorthEast().lat(),
            lng: viewport.getNorthEast().lng(),
        },
        {
            lat: viewport.getSouthWest().lat(),
            lng: viewport.getNorthEast().lng(),
        },
        {
            lat: viewport.getSouthWest().lat(),
            lng: viewport.getSouthWest().lng(),
        },
    ];
}
