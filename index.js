       document.getElementById("decide").addEventListener("click", function() {
            const address = document.getElementById("textLocation").value;
            var radius = parseInt(document.getElementById("radius").value);

            //convert radius from miles to meters 
            radius = radius * 1610;

            const keyword = document.getElementById("keyword").value;
            
            //Remove data fields from document object model
            const text_location = document.getElementById("text_location_div");
            const radius_div = document.getElementById("radius_div");
            const keyword_div = document.getElementById("keyword_div");
            const instructions = document.getElementById("instructions");
            const button = document.getElementById('decide');

            text_location.remove()
            radius_div.remove()
            keyword_div.remove()
            instructions.remove();
            button.remove();




// Function to fetch restaurant data based on address, radius, and food type
async function fetchRestaurant(address, radius, foodType) {
    const apiKey = 'APIKEY'; // Replace with your actual API key
    
    try {
        // Geocode the address to get coordinates
        const location = await geocodeAddress(address);
        
        // Fetch nearby restaurants based on coordinates, radius, and food type
        const restaurant = await fetchRestaurantByLocation(location, radius, foodType, apiKey);
        return restaurant;
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        return null;
    }
}

// Function to geocode the address and get coordinates
async function geocodeAddress(address) {
    const apiKey = 'APIKEY'; // Replace with your actual API key
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            return `${location.lat},${location.lng}`;
        } else {
            throw new Error(data.status);
        }
    } catch (error) {
        console.error('Error geocoding address:', error);
        throw error;
    }
}

// Function to fetch nearby restaurants based on coordinates, radius, and food type
async function fetchRestaurantByLocation(location, radius, foodType, apiKey) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=restaurant&keyword=${foodType}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
            const restaurant = data.results[0];
            const restaurantName = restaurant.name;
            const restaurantAddress = restaurant.vicinity;
            const photoReference = restaurant.photos ? restaurant.photos[0].photo_reference : null;
            const photoUrl = photoReference ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}` : null;
            
            return { name: restaurantName, address: restaurantAddress, imageUrl: photoUrl };
        } else {
            document.getElementById("name").innerHTML = "No Restaurant Found";
            throw new Error('No restaurants found.');
        }
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        throw error;
    }
}


fetchRestaurant(address, radius, keyword)
    .then(restaurant => {
        if (restaurant) {

            var name = restaurant.name; 
            var vicinity = restaurant.address;
            var photoReference = restaurant.imageUrl;
    
            // Update HTML elements with the extracted information 
            document.getElementById("name").innerHTML = name;
            document.getElementById("address").innerHTML = vicinity;
            document.getElementById("display").innerHTML = "We've decided that you are going to eat at...";
            document.getElementById("restaurant_photo").setAttribute("src", `${photoReference}`);
            document.getElementById("restaurant_photo").setAttribute("height", "200px");
            document.getElementById("restaurant_photo").setAttribute("width", "200px");
    
    
            console.log('Restaurant Name:', restaurant.name);
            console.log('Restaurant Address:', restaurant.address);
            console.log('Restaurant Image URL:', restaurant.imageUrl);
        } else {
            console.log('No restaurant found.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

});