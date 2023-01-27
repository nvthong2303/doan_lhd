/* eslint-disable prettier/prettier */
import { Logger } from "@nestjs/common";

const example = async (req, res) => {
  try {
    // handle
    const user = {}

    if (user) {
      // 
      return res.status(200).json({
        code: 200,
        data: {},
        message: 'Create success',
      });
    } else {
      return res.status(401).json({
        code: 401,
        message: 'Not found',
      })
    }
  } catch (error) {
    Logger.log('error message', error);
    return res.status(400).json({
      code: 400,
      message: 'Bad request',
    });
  }
}