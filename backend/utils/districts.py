"""
All India districts with bounding boxes and centers.
Covers all 28 states + 8 UTs with major districts.
bbox format: [min_lon, min_lat, max_lon, max_lat]
"""

DISTRICTS = {
    # ── MAHARASHTRA ────────────────────────────────────────────
    "Nagpur":        {"bbox": [78.6, 20.7, 79.6, 21.7], "center": [21.1458, 79.0882], "state": "Maharashtra"},
    "Pune":          {"bbox": [73.4, 18.2, 74.3, 18.9], "center": [18.5204, 73.8567], "state": "Maharashtra"},
    "Wardha":        {"bbox": [78.3, 20.4, 79.0, 21.0], "center": [20.7453, 78.6022], "state": "Maharashtra"},
    "Mumbai":        {"bbox": [72.7, 18.8, 73.0, 19.3], "center": [19.0760, 72.8777], "state": "Maharashtra"},
    "Nashik":        {"bbox": [73.5, 19.7, 74.1, 20.3], "center": [20.0059, 73.7898], "state": "Maharashtra"},
    "Aurangabad":    {"bbox": [75.0, 19.6, 75.7, 20.2], "center": [19.8762, 75.3433], "state": "Maharashtra"},
    "Kolhapur":      {"bbox": [73.9, 16.4, 74.5, 17.0], "center": [16.7050, 74.2433], "state": "Maharashtra"},
    "Solapur":       {"bbox": [75.6, 17.4, 76.2, 18.0], "center": [17.6868, 75.9064], "state": "Maharashtra"},
    "Amravati":      {"bbox": [77.3, 20.6, 78.2, 21.3], "center": [20.9320, 77.7523], "state": "Maharashtra"},
    "Latur":         {"bbox": [76.3, 18.2, 77.0, 18.7], "center": [18.4088, 76.5604], "state": "Maharashtra"},
    "Sangli":        {"bbox": [74.3, 16.7, 75.0, 17.2], "center": [16.8524, 74.5815], "state": "Maharashtra"},
    "Satara":        {"bbox": [73.7, 17.4, 74.5, 18.1], "center": [17.6805, 73.9951], "state": "Maharashtra"},
    "Nanded":        {"bbox": [77.0, 17.9, 77.8, 18.5], "center": [18.2968, 77.2818], "state": "Maharashtra"},
    "Thane":         {"bbox": [72.9, 19.1, 73.4, 19.7], "center": [19.2183, 72.9781], "state": "Maharashtra"},
    "Jalgaon":       {"bbox": [75.2, 20.8, 76.1, 21.4], "center": [21.0077, 75.5626], "state": "Maharashtra"},
    "Akola":         {"bbox": [76.8, 20.3, 77.4, 20.9], "center": [20.7096, 77.0001], "state": "Maharashtra"},
    "Ahmednagar":    {"bbox": [74.0, 18.6, 75.1, 19.5], "center": [19.0948, 74.7480], "state": "Maharashtra"},
    "Ratnagiri":     {"bbox": [73.2, 16.5, 73.6, 17.6], "center": [17.0000, 73.3000], "state": "Maharashtra"},
    "Osmanabad":     {"bbox": [75.8, 17.7, 76.5, 18.3], "center": [18.1789, 76.0406], "state": "Maharashtra"},
    "Beed":          {"bbox": [75.4, 18.4, 76.1, 19.1], "center": [18.9890, 75.7601], "state": "Maharashtra"},

    # ── UTTAR PRADESH ─────────────────────────────────────────
    "Lucknow":       {"bbox": [80.6, 26.6, 81.2, 27.1], "center": [26.8467, 80.9462], "state": "Uttar Pradesh"},
    "Agra":          {"bbox": [77.7, 26.9, 78.2, 27.4], "center": [27.1767, 78.0081], "state": "Uttar Pradesh"},
    "Varanasi":      {"bbox": [82.7, 25.1, 83.2, 25.5], "center": [25.3176, 82.9739], "state": "Uttar Pradesh"},
    "Kanpur":        {"bbox": [80.0, 26.2, 80.6, 26.7], "center": [26.4499, 80.3319], "state": "Uttar Pradesh"},
    "Allahabad":     {"bbox": [81.6, 25.2, 82.0, 25.6], "center": [25.4358, 81.8463], "state": "Uttar Pradesh"},
    "Meerut":        {"bbox": [77.4, 28.6, 77.9, 29.1], "center": [28.9845, 77.7064], "state": "Uttar Pradesh"},
    "Ghaziabad":     {"bbox": [77.3, 28.5, 77.7, 28.9], "center": [28.6692, 77.4538], "state": "Uttar Pradesh"},
    "Noida":         {"bbox": [77.2, 28.4, 77.7, 28.7], "center": [28.5355, 77.3910], "state": "Uttar Pradesh"},
    "Gorakhpur":     {"bbox": [83.1, 26.6, 83.6, 27.0], "center": [26.7606, 83.3732], "state": "Uttar Pradesh"},
    "Mathura":       {"bbox": [77.3, 27.2, 77.8, 27.7], "center": [27.4924, 77.6737], "state": "Uttar Pradesh"},

    # ── RAJASTHAN ─────────────────────────────────────────────
    "Jaipur":        {"bbox": [75.5, 26.7, 76.1, 27.2], "center": [26.9124, 75.7873], "state": "Rajasthan"},
    "Jodhpur":       {"bbox": [72.7, 26.1, 73.3, 26.7], "center": [26.2389, 73.0243], "state": "Rajasthan"},
    "Udaipur":       {"bbox": [73.4, 24.4, 74.0, 24.9], "center": [24.5854, 73.7125], "state": "Rajasthan"},
    "Kota":          {"bbox": [75.7, 24.7, 76.3, 25.3], "center": [25.2138, 75.8648], "state": "Rajasthan"},
    "Ajmer":         {"bbox": [74.5, 26.2, 75.1, 26.7], "center": [26.4499, 74.6399], "state": "Rajasthan"},
    "Bikaner":       {"bbox": [72.7, 27.7, 73.6, 28.4], "center": [28.0229, 73.3119], "state": "Rajasthan"},
    "Alwar":         {"bbox": [76.3, 27.3, 77.0, 27.9], "center": [27.5530, 76.6346], "state": "Rajasthan"},
    "Bharatpur":     {"bbox": [77.1, 27.0, 77.6, 27.6], "center": [27.2152, 77.4890], "state": "Rajasthan"},
    "Chittorgarh":   {"bbox": [74.3, 24.5, 75.1, 25.0], "center": [24.8887, 74.6269], "state": "Rajasthan"},
    "Jaisalmer":     {"bbox": [69.7, 26.3, 71.3, 27.8], "center": [26.9157, 70.9083], "state": "Rajasthan"},

    # ── GUJARAT ───────────────────────────────────────────────
    "Ahmedabad":     {"bbox": [72.3, 22.9, 73.1, 23.4], "center": [23.0225, 72.5714], "state": "Gujarat"},
    "Surat":         {"bbox": [72.6, 21.0, 73.1, 21.4], "center": [21.1702, 72.8311], "state": "Gujarat"},
    "Vadodara":      {"bbox": [73.0, 22.2, 73.4, 22.6], "center": [22.3072, 73.1812], "state": "Gujarat"},
    "Rajkot":        {"bbox": [70.5, 22.1, 71.1, 22.6], "center": [22.3039, 70.8022], "state": "Gujarat"},
    "Gandhinagar":   {"bbox": [72.4, 23.1, 72.8, 23.4], "center": [23.2156, 72.6369], "state": "Gujarat"},
    "Bharuch":       {"bbox": [72.5, 21.5, 73.1, 22.1], "center": [21.7051, 72.9959], "state": "Gujarat"},
    "Anand":         {"bbox": [72.7, 22.4, 73.1, 22.8], "center": [22.5645, 72.9289], "state": "Gujarat"},
    "Mehsana":       {"bbox": [72.2, 23.5, 72.6, 24.0], "center": [23.6015, 72.3870], "state": "Gujarat"},

    # ── MADHYA PRADESH ────────────────────────────────────────
    "Bhopal":        {"bbox": [77.0, 23.0, 77.6, 23.5], "center": [23.2599, 77.4126], "state": "Madhya Pradesh"},
    "Indore":        {"bbox": [75.6, 22.5, 76.1, 22.9], "center": [22.7196, 75.8577], "state": "Madhya Pradesh"},
    "Gwalior":       {"bbox": [77.8, 26.1, 78.4, 26.5], "center": [26.2183, 78.1828], "state": "Madhya Pradesh"},
    "Jabalpur":      {"bbox": [79.7, 23.0, 80.2, 23.4], "center": [23.1815, 79.9864], "state": "Madhya Pradesh"},
    "Ujjain":        {"bbox": [75.6, 23.0, 76.0, 23.4], "center": [23.1765, 75.7885], "state": "Madhya Pradesh"},
    "Sagar":         {"bbox": [78.4, 23.6, 79.0, 24.1], "center": [23.8388, 78.7378], "state": "Madhya Pradesh"},
    "Rewa":          {"bbox": [81.1, 24.3, 81.6, 24.8], "center": [24.5362, 81.3037], "state": "Madhya Pradesh"},

    # ── KARNATAKA ─────────────────────────────────────────────
    "Bengaluru":     {"bbox": [77.3, 12.8, 77.9, 13.2], "center": [12.9716, 77.5946], "state": "Karnataka"},
    "Mysuru":        {"bbox": [76.3, 12.1, 76.8, 12.6], "center": [12.2958, 76.6394], "state": "Karnataka"},
    "Hubli":         {"bbox": [74.9, 15.2, 75.4, 15.7], "center": [15.3647, 75.1240], "state": "Karnataka"},
    "Mangaluru":     {"bbox": [74.7, 12.7, 75.1, 13.0], "center": [12.9141, 74.8560], "state": "Karnataka"},
    "Belagavi":      {"bbox": [74.3, 15.7, 75.0, 16.2], "center": [15.8497, 74.4977], "state": "Karnataka"},
    "Ballari":       {"bbox": [76.5, 14.8, 77.2, 15.4], "center": [15.1394, 76.9214], "state": "Karnataka"},
    "Dharwad":       {"bbox": [74.9, 15.3, 75.5, 15.7], "center": [15.4589, 75.0078], "state": "Karnataka"},
    "Tumkur":        {"bbox": [76.8, 13.1, 77.4, 13.7], "center": [13.3379, 77.1173], "state": "Karnataka"},

    # ── TAMIL NADU ────────────────────────────────────────────
    "Chennai":       {"bbox": [79.9, 12.9, 80.3, 13.3], "center": [13.0827, 80.2707], "state": "Tamil Nadu"},
    "Coimbatore":    {"bbox": [76.6, 10.8, 77.1, 11.2], "center": [11.0168, 76.9558], "state": "Tamil Nadu"},
    "Madurai":       {"bbox": [78.0, 9.7, 78.4, 10.2], "center": [9.9252, 78.1198], "state": "Tamil Nadu"},
    "Salem":         {"bbox": [77.9, 11.5, 78.4, 12.0], "center": [11.6643, 78.1460], "state": "Tamil Nadu"},
    "Tiruchirappalli": {"bbox": [78.3, 10.5, 78.9, 11.0], "center": [10.7905, 78.7047], "state": "Tamil Nadu"},
    "Tirunelveli":   {"bbox": [77.5, 8.6, 78.1, 9.1], "center": [8.7139, 77.7567], "state": "Tamil Nadu"},
    "Vellore":       {"bbox": [78.8, 12.7, 79.3, 13.1], "center": [12.9165, 79.1325], "state": "Tamil Nadu"},

    # ── ANDHRA PRADESH ────────────────────────────────────────
    "Visakhapatnam": {"bbox": [83.0, 17.5, 83.5, 18.0], "center": [17.6868, 83.2185], "state": "Andhra Pradesh"},
    "Vijayawada":    {"bbox": [80.5, 16.4, 81.0, 16.8], "center": [16.5062, 80.6480], "state": "Andhra Pradesh"},
    "Guntur":        {"bbox": [79.8, 16.1, 80.3, 16.5], "center": [16.3067, 80.4365], "state": "Andhra Pradesh"},
    "Kurnool":       {"bbox": [77.8, 15.5, 78.3, 16.0], "center": [15.8281, 78.0373], "state": "Andhra Pradesh"},
    "Nellore":       {"bbox": [79.6, 14.2, 80.1, 14.7], "center": [14.4426, 79.9865], "state": "Andhra Pradesh"},
    "Tirupati":      {"bbox": [79.2, 13.5, 79.7, 14.0], "center": [13.6288, 79.4192], "state": "Andhra Pradesh"},

    # ── TELANGANA ─────────────────────────────────────────────
    "Hyderabad":     {"bbox": [78.2, 17.2, 78.7, 17.7], "center": [17.3850, 78.4867], "state": "Telangana"},
    "Warangal":      {"bbox": [79.3, 17.8, 79.9, 18.3], "center": [18.0000, 79.5940], "state": "Telangana"},
    "Nizamabad":     {"bbox": [77.9, 18.5, 78.4, 19.0], "center": [18.6725, 78.0942], "state": "Telangana"},
    "Karimnagar":    {"bbox": [78.9, 18.3, 79.4, 18.8], "center": [18.4386, 79.1288], "state": "Telangana"},
    "Khammam":       {"bbox": [80.0, 17.0, 80.7, 17.5], "center": [17.2473, 80.1514], "state": "Telangana"},

    # ── KERALA ────────────────────────────────────────────────
    "Thiruvananthapuram": {"bbox": [76.7, 8.3, 77.2, 8.8], "center": [8.5241, 76.9366], "state": "Kerala"},
    "Kochi":         {"bbox": [76.1, 9.8, 76.6, 10.2], "center": [9.9312, 76.2673], "state": "Kerala"},
    "Kozhikode":     {"bbox": [75.6, 11.2, 76.1, 11.6], "center": [11.2588, 75.7804], "state": "Kerala"},
    "Thrissur":      {"bbox": [76.0, 10.3, 76.5, 10.8], "center": [10.5276, 76.2144], "state": "Kerala"},
    "Kannur":        {"bbox": [75.2, 11.7, 75.7, 12.2], "center": [11.8745, 75.3704], "state": "Kerala"},
    "Palakkad":      {"bbox": [76.4, 10.5, 77.0, 11.0], "center": [10.7867, 76.6548], "state": "Kerala"},

    # ── WEST BENGAL ───────────────────────────────────────────
    "Kolkata":       {"bbox": [88.2, 22.4, 88.5, 22.7], "center": [22.5726, 88.3639], "state": "West Bengal"},
    "Howrah":        {"bbox": [87.9, 22.5, 88.2, 22.8], "center": [22.5958, 88.2636], "state": "West Bengal"},
    "Darjeeling":    {"bbox": [88.0, 27.0, 88.7, 27.4], "center": [27.0410, 88.2663], "state": "West Bengal"},
    "Murshidabad":   {"bbox": [88.0, 24.0, 88.7, 24.5], "center": [24.1832, 88.2785], "state": "West Bengal"},
    "Bardhaman":     {"bbox": [87.2, 23.1, 87.8, 23.6], "center": [23.2324, 87.8615], "state": "West Bengal"},
    "Siliguri":      {"bbox": [88.3, 26.6, 88.8, 27.0], "center": [26.7271, 88.3953], "state": "West Bengal"},

    # ── ODISHA ────────────────────────────────────────────────
    "Bhubaneswar":   {"bbox": [85.5, 20.1, 86.0, 20.5], "center": [20.2961, 85.8245], "state": "Odisha"},
    "Cuttack":       {"bbox": [85.6, 20.3, 86.0, 20.7], "center": [20.4625, 85.8828], "state": "Odisha"},
    "Rourkela":      {"bbox": [84.7, 22.1, 85.1, 22.5], "center": [22.2492, 84.8828], "state": "Odisha"},
    "Puri":          {"bbox": [85.5, 19.6, 86.0, 20.0], "center": [19.8106, 85.8314], "state": "Odisha"},
    "Sambalpur":     {"bbox": [83.7, 21.4, 84.2, 21.9], "center": [21.4669, 83.9756], "state": "Odisha"},

    # ── BIHAR ─────────────────────────────────────────────────
    "Patna":         {"bbox": [85.0, 25.4, 85.5, 25.8], "center": [25.5941, 85.1376], "state": "Bihar"},
    "Gaya":          {"bbox": [84.7, 24.6, 85.2, 25.0], "center": [24.7955, 85.0002], "state": "Bihar"},
    "Bhagalpur":     {"bbox": [86.7, 25.1, 87.2, 25.5], "center": [25.2425, 86.9842], "state": "Bihar"},
    "Muzaffarpur":   {"bbox": [85.2, 26.0, 85.7, 26.4], "center": [26.1209, 85.3647], "state": "Bihar"},
    "Darbhanga":     {"bbox": [85.7, 26.0, 86.2, 26.4], "center": [26.1542, 85.8918], "state": "Bihar"},

    # ── JHARKHAND ─────────────────────────────────────────────
    "Ranchi":        {"bbox": [85.0, 23.2, 85.5, 23.7], "center": [23.3441, 85.3096], "state": "Jharkhand"},
    "Dhanbad":       {"bbox": [86.2, 23.6, 86.6, 24.0], "center": [23.7957, 86.4304], "state": "Jharkhand"},
    "Jamshedpur":    {"bbox": [85.9, 22.7, 86.3, 23.1], "center": [22.8046, 86.2029], "state": "Jharkhand"},
    "Bokaro":        {"bbox": [85.8, 23.5, 86.3, 24.0], "center": [23.6693, 86.1511], "state": "Jharkhand"},

    # ── CHHATTISGARH ──────────────────────────────────────────
    "Raipur":        {"bbox": [81.4, 21.1, 82.0, 21.5], "center": [21.2514, 81.6296], "state": "Chhattisgarh"},
    "Bhilai":        {"bbox": [81.0, 21.1, 81.5, 21.5], "center": [21.1938, 81.3509], "state": "Chhattisgarh"},
    "Bilaspur":      {"bbox": [81.8, 22.0, 82.3, 22.4], "center": [22.0797, 82.1409], "state": "Chhattisgarh"},
    "Durg":          {"bbox": [81.0, 21.1, 81.5, 21.5], "center": [21.1904, 81.2849], "state": "Chhattisgarh"},

    # ── ASSAM ─────────────────────────────────────────────────
    "Guwahati":      {"bbox": [91.4, 26.0, 91.9, 26.4], "center": [26.1445, 91.7362], "state": "Assam"},
    "Dibrugarh":     {"bbox": [94.7, 27.3, 95.2, 27.8], "center": [27.4728, 94.9120], "state": "Assam"},
    "Silchar":       {"bbox": [92.6, 24.6, 93.1, 25.0], "center": [24.8333, 92.7789], "state": "Assam"},
    "Jorhat":        {"bbox": [94.0, 26.5, 94.5, 27.0], "center": [26.7509, 94.2037], "state": "Assam"},

    # ── PUNJAB ────────────────────────────────────────────────
    "Ludhiana":      {"bbox": [75.6, 30.7, 76.1, 31.1], "center": [30.9010, 75.8573], "state": "Punjab"},
    "Amritsar":      {"bbox": [74.7, 31.5, 75.2, 31.9], "center": [31.6340, 74.8723], "state": "Punjab"},
    "Jalandhar":     {"bbox": [75.5, 31.2, 76.0, 31.6], "center": [31.3260, 75.5762], "state": "Punjab"},
    "Patiala":       {"bbox": [76.1, 30.2, 76.6, 30.6], "center": [30.3398, 76.3869], "state": "Punjab"},
    "Mohali":        {"bbox": [76.5, 30.6, 76.9, 31.0], "center": [30.7046, 76.7179], "state": "Punjab"},

    # ── HARYANA ───────────────────────────────────────────────
    "Gurugram":      {"bbox": [76.8, 28.2, 77.2, 28.6], "center": [28.4595, 77.0266], "state": "Haryana"},
    "Faridabad":     {"bbox": [77.2, 28.2, 77.6, 28.6], "center": [28.4089, 77.3178], "state": "Haryana"},
    "Ambala":        {"bbox": [76.5, 30.2, 77.0, 30.6], "center": [30.3782, 76.7767], "state": "Haryana"},
    "Rohtak":        {"bbox": [76.5, 28.7, 77.0, 29.1], "center": [28.8955, 76.6066], "state": "Haryana"},
    "Hisar":         {"bbox": [75.5, 29.0, 76.0, 29.4], "center": [29.1492, 75.7217], "state": "Haryana"},

    # ── HIMACHAL PRADESH ──────────────────────────────────────
    "Shimla":        {"bbox": [77.0, 31.0, 77.5, 31.4], "center": [31.1048, 77.1734], "state": "Himachal Pradesh"},
    "Manali":        {"bbox": [77.0, 32.1, 77.4, 32.5], "center": [32.2396, 77.1887], "state": "Himachal Pradesh"},
    "Dharamshala":   {"bbox": [76.2, 32.1, 76.6, 32.5], "center": [32.2190, 76.3234], "state": "Himachal Pradesh"},

    # ── UTTARAKHAND ───────────────────────────────────────────
    "Dehradun":      {"bbox": [77.8, 30.2, 78.2, 30.6], "center": [30.3165, 78.0322], "state": "Uttarakhand"},
    "Haridwar":      {"bbox": [78.0, 29.8, 78.4, 30.2], "center": [29.9457, 78.1642], "state": "Uttarakhand"},
    "Nainital":      {"bbox": [79.2, 29.2, 79.7, 29.6], "center": [29.3919, 79.4542], "state": "Uttarakhand"},

    # ── GOA ───────────────────────────────────────────────────
    "Panaji":        {"bbox": [73.7, 15.3, 74.1, 15.6], "center": [15.4909, 73.8278], "state": "Goa"},
    "Margao":        {"bbox": [73.9, 15.2, 74.2, 15.5], "center": [15.2832, 73.9862], "state": "Goa"},

    # ── DELHI ─────────────────────────────────────────────────
    "New Delhi":     {"bbox": [76.8, 28.4, 77.4, 28.9], "center": [28.6139, 77.2090], "state": "Delhi"},
    "North Delhi":   {"bbox": [77.0, 28.7, 77.3, 29.0], "center": [28.7041, 77.1025], "state": "Delhi"},
    "South Delhi":   {"bbox": [77.1, 28.4, 77.4, 28.7], "center": [28.5245, 77.2066], "state": "Delhi"},
    "East Delhi":    {"bbox": [77.2, 28.6, 77.5, 28.8], "center": [28.6600, 77.3100], "state": "Delhi"},

    # ── JAMMU & KASHMIR ───────────────────────────────────────
    "Srinagar":      {"bbox": [74.6, 33.8, 75.1, 34.3], "center": [34.0837, 74.7973], "state": "Jammu & Kashmir"},
    "Jammu":         {"bbox": [74.5, 32.5, 75.0, 33.0], "center": [32.7266, 74.8570], "state": "Jammu & Kashmir"},
    "Leh":           {"bbox": [77.2, 34.0, 77.8, 34.5], "center": [34.1526, 77.5770], "state": "Jammu & Kashmir"},

    # ── SIKKIM ────────────────────────────────────────────────
    "Gangtok":       {"bbox": [88.4, 27.2, 88.7, 27.5], "center": [27.3314, 88.6138], "state": "Sikkim"},

    # ── TRIPURA ───────────────────────────────────────────────
    "Agartala":      {"bbox": [91.1, 23.6, 91.5, 24.0], "center": [23.8315, 91.2868], "state": "Tripura"},

    # ── MEGHALAYA ─────────────────────────────────────────────
    "Shillong":      {"bbox": [91.7, 25.5, 92.0, 25.8], "center": [25.5788, 91.8933], "state": "Meghalaya"},

    # ── MANIPUR ───────────────────────────────────────────────
    "Imphal":        {"bbox": [93.7, 24.7, 94.1, 25.1], "center": [24.8170, 93.9368], "state": "Manipur"},

    # ── NAGALAND ──────────────────────────────────────────────
    "Kohima":        {"bbox": [93.9, 25.5, 94.3, 25.9], "center": [25.6751, 94.1086], "state": "Nagaland"},

    # ── MIZORAM ───────────────────────────────────────────────
    "Aizawl":        {"bbox": [92.6, 23.5, 93.0, 24.0], "center": [23.7271, 92.7176], "state": "Mizoram"},

    # ── ARUNACHAL PRADESH ─────────────────────────────────────
    "Itanagar":      {"bbox": [93.5, 27.0, 93.9, 27.4], "center": [27.0844, 93.6053], "state": "Arunachal Pradesh"},

    # ── ANDAMAN & NICOBAR ─────────────────────────────────────
    "Port Blair":    {"bbox": [92.5, 11.5, 93.0, 12.0], "center": [11.6234, 92.7265], "state": "Andaman & Nicobar"},

    # ── LAKSHADWEEP ───────────────────────────────────────────
    "Kavaratti":     {"bbox": [72.5, 10.4, 72.8, 10.7], "center": [10.5669, 72.6420], "state": "Lakshadweep"},

    # ── PUDUCHERRY ────────────────────────────────────────────
    "Puducherry":    {"bbox": [79.6, 11.7, 80.0, 12.0], "center": [11.9416, 79.8083], "state": "Puducherry"},
}


def get_district(name: str):
    """Get district info by name (case-insensitive)."""
    for k, v in DISTRICTS.items():
        if k.lower() == name.lower():
            return k, v
    return None, None


def list_districts():
    """Return list of district names."""
    return list(DISTRICTS.keys())


def list_by_state():
    """Return districts grouped by state."""
    result = {}
    for name, info in DISTRICTS.items():
        state = info["state"]
        if state not in result:
            result[state] = []
        result[state].append(name)
    return result
