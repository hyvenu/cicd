
from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction


class NotificationService:

    @classmethod
    @transaction.atomic
    def send_email(cls, recipient_list,name):
        subject = 'welcome to Saffran'
        message = f'HI {name}, Congratulations, your Order is Placed successfully..'
#         message = """\
#                 <html>
#                     <head>
#                     #card {
#                           position: relative;
#                           width: 320px;
#                           display: block;
#                           margin: 40px auto;
#                           text-align: center;
#                           font-family: 'Source Sans Pro', sans-serif;
#                         }
#
#                     #upper-side {
#                           padding: 2em;
#                           background-color: #8BC34A;
#                           display: block;
#                           color: #fff;
#                           border-top-right-radius: 8px;
#                           border-top-left-radius: 8px;
#                         }
#
#                         #checkmark {
#   font-weight: lighter;
#   fill: #fff;
#   margin: -3.5em auto auto 20px;
# }
# #status {
#   font-weight: lighter;
#   text-transform: uppercase;
#   letter-spacing: 2px;
#   font-size: 1em;
#   margin-top: -.2em;
#   margin-bottom: 0;
# }
# #lower-side {
#   padding: 2em 2em 5em 2em;
#   background: #fff;
#   display: block;
#   border-bottom-right-radius: 8px;
#   border-bottom-left-radius: 8px;
# }
#  #message {
#   margin-top: -.5em;
#   color: #757575;
#   letter-spacing: 1px;
# }
#                     </head>
#                     <body>
#                         <div id='card' class="animated fadeIn">
#                               <div id='upper-side'>
#                                 <?xml version="1.0" encoding="utf-8"?>
#                                   <!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
#                                   <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
#
#                                     <circle fill="none" stroke="#ffffff" stroke-width="5" stroke-miterlimit="10" cx="109.486" cy="104.353" r="32.53" />
#                                   </svg>
#                                   <h3 id='status'>
#                                   Hi {name}
#                                 </h3>
#                               </div>
#                               <div id='lower-side'>
#                                 <p id='message'>
#                                   Congratulations, your Order is Placed successfully.
#                                 </p>
#
#                               </div>
#                         </div>
#                     </body>
#                 </html
#         """
#         message_new = message.format(name=name)
        email_from = settings.EMAIL_HOST_USER
        # recipient_list = ['sangli.sandeep1992@gmail.com']
        send_mail(subject, message, email_from, [recipient_list])




# notification = NotificationService()
# notification.send_email()