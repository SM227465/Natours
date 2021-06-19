const path = require("path");
const { static } = require("express");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/error");

const tourRouter = require("./routes/tour");
const userRouter = require("./routes/user");
const reviewRouter = require("./routes/review");
const bookingRouter = require("./routes/booking");
const viewRouter = require("./routes/view");

const app = express();

// setting templating view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1. GLOBAL MIDDLEWARE
app.use(express.static(path.join(__dirname, "public")));

// i) Set security HTTP headers
app.use(helmet());

// ii)  Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// iii) Limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour.",
});
app.use("/api", limiter);

// iv) Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// v) Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// vi) Data sanitization against XSS
app.use(xss());

// Vii) Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// viii) serving static files
// app.use(express.static(`${__dirname}/public`));

// app.use(express.static("public"));

// app.get("/api/v1/tours", getTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// 2. ROUTES
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
