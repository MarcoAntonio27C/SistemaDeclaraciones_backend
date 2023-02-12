import CreateError from 'http-errors';
import Sendgrid from '@sendgrid/mail';
import { StatusCodes } from 'http-status-codes';
import { strings } from '../config';


export class SendgridClient {
  private static async send(message: any): Promise<void> {
    try {
      await Sendgrid.send(message);
    } catch(e) {
      throw CreateError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Something went wrong at forgotPassword',
        {debug_info: {error: e}},
      );
    }
  }

  public static async sendRecoveryPasswordAPI(email:string, token:string) : Promise<void>{
    const axios = require('axios').default;

    axios.post('https://fiscalia.puebla.gob.mx/api_declaracion/api/declaracion/sendemailpassword',{
      To:email,
      Subject:'Recuperacion de contraseña',
      Text: strings.formatString(strings.textRecoveryEmail, {
        url: `${process.env.FE_RESET_PASSWORD_URL}/restablecer-contrasena`,
        token: token,
      }),
    })
    .then(function(response: boolean){
      console.log(response);
      //user.save();
    })
    .catch(function(error:boolean){
      console.log(error);
    })
  }

  public static async sendRecoveryPassword(email: string, token: string): Promise<void> {
    const message = {
      to: email,
      from: `${process.env.SENDGRID_MAIL_SENDER}`,
      subject: strings.subjectRecoveryEmail,
      text: strings.formatString(strings.textRecoveryEmail, {
        url: `${process.env.FE_RESET_PASSWORD_URL}/restablecer-contrasena`,
        token: token,
      }),
    };

    await SendgridClient.send(message);
  }

  public static async sendDeclarationFile(email: string, attachment: string): Promise<void> {
    const now = new Date(Date.now());
    const today = now.toISOString();
    const message = {
      to: email,
      from: `${process.env.SENDGRID_MAIL_SENDER}`,
      subject: strings.subjectDeclarationFile,
      text: strings.textDeclarationFile,
      attachments: [{
        content: attachment,
        filename: `acuse-declaracion[${today}].pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      }]
    };

    await SendgridClient.send(message);
  }

  public static async sendDeclarationFileAPI(email: string, attachment: string): Promise<void>{
    const axios = require('axios').default;

    axios.post('https://fiscalia.puebla.gob.mx/api_declaracion/api/declaracion/sendemailfile',
    {
      To:email,
      Subject:strings.subjectDeclarationFile,
      Text: strings.textDeclarationFile,
      File:attachment
    })
    .then(function(response: boolean){
      console.log(response);
      //user.save();
    })
    .catch(function(error:boolean){
      console.log(error);
    })
  }
}
