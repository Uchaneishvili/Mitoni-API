/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         specialization:
 *           type: string
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         services:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               service:
 *                 $ref: '#/components/schemas/Service'
 *
 *     CreateStaffInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - specialization
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         lastName:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         specialization:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *
 *     UpdateStaffInput:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         lastName:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         specialization:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *         isActive:
 *           type: boolean
 *
 *     AssignServicesInput:
 *       type: object
 *       required:
 *         - serviceIds
 *       properties:
 *         serviceIds:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: string
 *             format: uuid
 */

/**
 * @swagger
 * /staff:
 *   get:
 *     summary: List all staff members
 *     tags: [Staff]
 *     responses:
 *       200:
 *         description: List of staff members with their assigned services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Staff'
 */

/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     summary: Get a staff member by ID
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Staff ID
 *     responses:
 *       200:
 *         description: Staff member details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       404:
 *         description: Staff member not found
 */

/**
 * @swagger
 * /staff:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStaffInput'
 *     responses:
 *       201:
 *         description: Staff member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /staff/{id}:
 *   put:
 *     summary: Update a staff member
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Staff ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStaffInput'
 *     responses:
 *       200:
 *         description: Staff member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Staff member not found
 */

/**
 * @swagger
 * /staff/{id}:
 *   delete:
 *     summary: Soft-delete a staff member (sets isActive to false)
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Staff ID
 *     responses:
 *       200:
 *         description: Staff member deactivated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       404:
 *         description: Staff member not found
 */

/**
 * @swagger
 * /staff/{id}/services:
 *   post:
 *     summary: Assign services to a staff member
 *     description: Replaces all currently assigned services with the provided list
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Staff ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignServicesInput'
 *     responses:
 *       200:
 *         description: Services assigned successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Staff member not found
 */
