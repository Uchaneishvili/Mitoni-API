/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         staffId:
 *           type: string
 *           format: uuid
 *         serviceId:
 *           type: string
 *           format: uuid
 *         customerName:
 *           type: string
 *         customerPhone:
 *           type: string
 *           nullable: true
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         staff:
 *           $ref: '#/components/schemas/Staff'
 *         service:
 *           $ref: '#/components/schemas/Service'
 *
 *     CreateReservationInput:
 *       type: object
 *       required:
 *         - staffId
 *         - serviceId
 *         - customerName
 *         - startTime
 *       properties:
 *         staffId:
 *           type: string
 *           format: uuid
 *         serviceId:
 *           type: string
 *           format: uuid
 *         customerName:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *         customerPhone:
 *           type: string
 *           maxLength: 50
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Must be in the future
 *         notes:
 *           type: string
 *           maxLength: 500
 *
 *     UpdateReservationInput:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         staffId:
 *           type: string
 *           format: uuid
 *         serviceId:
 *           type: string
 *           format: uuid
 *         customerName:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *         customerPhone:
 *           type: string
 *           maxLength: 50
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Must be in the future
 *         notes:
 *           type: string
 *           maxLength: 500
 *
 *     UpdateReservationStatusInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: List all reservations
 *     tags: [Reservations]
 *     parameters:
 *       - in: query
 *         name: staffId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by staff member
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (ISO format)
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReservationInput'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Validation error or time slot conflict
 *       404:
 *         description: Service not found
 */

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReservationInput'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Validation error or time slot conflict
 *       404:
 *         description: Reservation or service not found
 */

/**
 * @swagger
 * /reservations/{id}/status:
 *   patch:
 *     summary: Update reservation status
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReservationStatusInput'
 *     responses:
 *       200:
 *         description: Reservation status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 */
