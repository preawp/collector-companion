import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/search", async (req, res) => {
  const query = req.query.q;

  try {
    const response = await axios.get(
      `https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=${query}`,
      {
        headers: {
            Authorization: "Bearer v^1.1#i^1#p^1#I^3#r^0#f^0#t^H4sIAAAAAAAA/+VYbWwURRju9Vqg1tr4SakEjxUSse7e7N3tfaz04rW00kI/4FqkTSiZ3Z1tt73bPXbmaA9NqFWJxpJIAhhQoWBIMbGiQWOQDwGBQPz6oSb6wyaQIAomShqDX4Cz16NcKwGkZ2zi/bnMzDvvPM/zvu/M7IDuSXkPr5m/5kKBbXJ2XzfozrbZ+HyQNym35A57dnFuFkgzsPV1z+rO6bF/PxfDaCQmLkY4ZugYObqiER2Lyc5SJm7qogGxhkUdRhEWiSyGQzULRRcHxJhpEEM2Ioyjal4p41IVVVIlN/R4ZF6VJNqrX/HZYJQyKh9QVRQQEBJkP+K9dBzjOKrSMYE6ofOBy8sCNwt8DcAjAl70eDiX29fMOJYgE2uGTk04wASTcMXkXDMN6/WhQoyRSagTJlgVqgzXharmVdQ2zHWm+QqmdAgTSOJ4dKvcUJBjCYzE0fWXwUlrMRyXZYQx4wwOrzDaqRi6AuYW4Cel9ga8HpcMAsgv84LbK2REykrDjEJyfRxWj6awatJURDrRSOJGilI1pHYkk1Srlrqomuew/hbFYURTNWSWMhVloaZQfT0TrNeiMQ3HCUvzKkJnGWy4bCkrS6ogCJIksIIkC8AV8KYWGvaWknnMSuWGrmiWaNhRa5AyRFGj0dq4RSFNG2pUp9eZIZVYiNLtvFc0dAWaraAORzFO2nQrrihKhXAkmzeOwMhsQkxNihM04mHsQFKiUgbGYprCjB1M5mIqfbpwKdNGSEx0Ojs7O7lON2eYrU4XALxzac3CsNyGopChtlatD9trN57AakkqMqIzsSaSRIxi6aK5SgHorUzQ43P7AoGU7qNhBcf2/q0jjbNzdEVkqkIggipUFQm6kVv18P5MVEgwlaROCweSYIKNQrMDkVgEyojmq47jUWRqiugWVJfbryJW8QZU1kO3PVYSFC/LqwgBhCRJDvj/T4Vys6keRrKJSEZyPWN5Hi4BndWNjSFJKVtQskDA1U8Y2N+oh0y9phLy1Quamn3VbYEaoz2MS2+2Gq5JvjyiUWUa6PqZEMCq9cyJMN/ABCnjoheWjRiqNyKanJhYAXabSj00SaIsnqDtMIpE6N+4qIZisarM7NgZI/kPN4tb4525k+o/OqWuyQpbiTuxWFnzMXUAYxpHzyGr1hOcbESdBqSXEKt7eRL1uHhr9P46oVhTghbbBKcpwxdPLkmXwytlzkTYiJv0zs3VWfewBqMD6fRUI6aV7uYSftz1HI3GCZQiaKIVdgYSXIMT7MjlfT6XX/DywDMuXnLyQF0+0bak8W3FOT22WTfJfzGCkejE4o6hrkhG17/w1eAc/YYRzEr++B7bCdBjO5pts4FywPIlYM4ke2OO/XYGawRxKTicBlUOa606/UQ3EdeBEjGomdl3TTV/DK2/vzL+3mGWDCx9uSHrtrSXlL5loGjkLSXPzuenPayA6VdHcvnCqQUuL3ADH/AA3uNpBg9eHc3h78u5540d2w9+3tK/MUfo/ZNc+JZ9uv3OzaBgxMhmy82iYc96atvaoXN5hTv3tDz5nHb6t8dzHhto3LHhubrewu0nPm1pOz6t/KcVi7d497fsUJYdfru4YLB4mzbl7n0zzmzqODT7YOHkAVsJW/v6zorGV/ef7dw7tJqbFtq6o/ezbZX9rNff/Bxf0niBcfQ8aEBfvA42TTl0O5LHx358tlHd5Udebdl5pSVW3Y/VNv/e4Vr66Lz2smTl/teXNnjajtw0f7IhWnRU5dnv7Nqbcm5AmGdd7erdmjWnqIZzp+PNa1f077q4oH3f8m3B33HCrpeKjp5/t4zRRs/W/jmwbOLJm9o3lUMBvO/OL3veS4iNn1yqver1u8+fO2Bt/oH94Z++Obopbw5CXnmOlAz/Vf+GW71iuGQ/gVPZQFy4xIAAA=="
        }
      }
    );

    res.json(response.data);
  } catch (error) {
   console.error("eBay error:");
    console.error(error.response?.data || error.message);
    res.status(500).json({
      error: "eBay request failed",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});