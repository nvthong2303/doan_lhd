/* eslint-disable prettier/prettier */
import { Logger } from "@nestjs/common";

const example = async (req, res) => {
  try {
    // handle

    return res.status(201).json({
      code: 201,
      message: 'Create success',
    });
  } catch (error) {
    Logger.log('error message', error);
    return res.status(400).json({
      code: 400,
      message: 'Bad request',
    });
  }
}