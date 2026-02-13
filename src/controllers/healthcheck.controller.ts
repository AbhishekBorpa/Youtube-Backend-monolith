import { ApiResponse } from "../utils/ApiResponse"
import { asyncHandler } from "../utils/asyncHandler"
import { Request, Response } from "express"

const healthcheck = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, { status: "OK" }, "Health check successful"))
})

export {
    healthcheck
}
