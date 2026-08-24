export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export const MAJOR_CITIES_BY_STATE = {
  "Tamil Nadu": [
    { name: "Chennai", lat: 13.0827, lng: 80.2707, pincode: "600001" },
    { name: "Coimbatore", lat: 11.0168, lng: 76.9558, pincode: "641001" },
    { name: "Madurai", lat: 9.9252, lng: 78.1198, pincode: "625001" },
    { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, pincode: "620001" },
    { name: "Salem", lat: 11.6643, lng: 78.1460, pincode: "636001" },
    { name: "Tirunelveli", lat: 8.7139, lng: 77.7567, pincode: "627001" },
    { name: "Erode", lat: 11.3410, lng: 77.7172, pincode: "638001" },
    { name: "Vellore", lat: 12.9165, lng: 79.1325, pincode: "632001" }
  ],
  "Karnataka": [
    { name: "Bengaluru", lat: 12.9716, lng: 77.5946, pincode: "560001" },
    { name: "Mysuru", lat: 12.2958, lng: 76.6394, pincode: "570001" },
    { name: "Mangaluru", lat: 12.9141, lng: 74.8560, pincode: "575001" },
    { name: "Hubballi", lat: 15.3647, lng: 75.1240, pincode: "580001" },
    { name: "Belagavi", lat: 15.8497, lng: 74.4977, pincode: "590001" }
  ],
  "Maharashtra": [
    { name: "Mumbai", lat: 19.0760, lng: 72.8777, pincode: "400001" },
    { name: "Pune", lat: 18.5204, lng: 73.8567, pincode: "411001" },
    { name: "Nagpur", lat: 21.1458, lng: 79.0882, pincode: "440001" },
    { name: "Nashik", lat: 19.9975, lng: 73.7898, pincode: "422001" },
    { name: "Thane", lat: 19.2183, lng: 72.9781, pincode: "400601" }
  ],
  "Telangana": [
    { name: "Hyderabad", lat: 17.3850, lng: 78.4867, pincode: "500001" },
    { name: "Warangal", lat: 17.9689, lng: 79.5941, pincode: "506001" },
    { name: "Nizamabad", lat: 18.6725, lng: 78.0941, pincode: "503001" }
  ],
  "Delhi": [
    { name: "New Delhi", lat: 28.6139, lng: 77.2090, pincode: "110001" },
    { name: "North Delhi", lat: 28.7041, lng: 77.1025, pincode: "110007" },
    { name: "South Delhi", lat: 28.5355, lng: 77.2500, pincode: "110017" }
  ],
  "West Bengal": [
    { name: "Kolkata", lat: 22.5726, lng: 88.3639, pincode: "700001" },
    { name: "Howrah", lat: 22.5958, lng: 88.2636, pincode: "711101" },
    { name: "Siliguri", lat: 26.7271, lng: 88.3953, pincode: "734001" }
  ],
  "Gujarat": [
    { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, pincode: "380001" },
    { name: "Surat", lat: 21.1702, lng: 72.8311, pincode: "395001" },
    { name: "Vadodara", lat: 22.3072, lng: 73.1812, pincode: "390001" }
  ],
  "Kerala": [
    { name: "Kochi", lat: 9.9312, lng: 76.2673, pincode: "682001" },
    { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, pincode: "695001" },
    { name: "Kozhikode", lat: 11.2588, lng: 75.7804, pincode: "673001" }
  ]
};

export const DEFAULT_INDIA_CENTER = [20.5937, 78.9629];
export const DEFAULT_INDIA_ZOOM = 5;

export const getCityCoordinates = (cityName, stateName) => {
  if (MAJOR_CITIES_BY_STATE[stateName]) {
    const city = MAJOR_CITIES_BY_STATE[stateName].find(c => c.name.toLowerCase() === cityName.toLowerCase());
    if (city) return [city.lat, city.lng];
  }
  // Default to Chennai or India center if unknown
  return [13.0827, 80.2707];
};
