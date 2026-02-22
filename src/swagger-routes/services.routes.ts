/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         durationMinutes:
 *           type: integer
 *         price:
 *           type: number
 *           format: float
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateServiceInput:
 *       type: object
 *       required:
 *         - name
 *         - durationMinutes
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *         durationMinutes:
 *           type: integer
 *           minimum: 5
 *           maximum: 480
 *         price:
 *           type: number
 *           format: float
 *           exclusiveMinimum: true
 *           minimum: 0
 *
 *     UpdateServiceInput:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *         durationMinutes:
 *           type: integer
 *           minimum: 5
 *           maximum: 480
 *         price:
 *           type: number
 *           format: float
 *           exclusiveMinimum: true
 *           minimum: 0
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: List all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service details (includes assigned staff)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Service'
 *                 - type: object
 *                   properties:
 *                     staff:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           staff:
 *                             $ref: '#/components/schemas/Staff'
 *       404:
 *         description: Service not found
 */

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceInput'
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateServiceInput'
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Service not found
 */

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Soft-delete a service (sets isActive to false)
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deactivated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 */
