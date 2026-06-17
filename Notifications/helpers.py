from datetime import timedelta
from django.utils import timezone
from .models import Notifications

def auto_expire_notifications():

    today = timezone.now().date()

    notifications = Notifications.objects.filter(is_active=True)

    for item in notifications:

        category = item.category.strip().upper()

        extra_data = item.extra_data or {}

        should_disable = False

        # NEW BATCH

        if category == "NEW BATCH":

            batch_date = extra_data.get("start_date")

            if batch_date:

                should_disable = (
                    today >= timezone.datetime.strptime(batch_date, "%Y-%m-%d").date()
                )

        # INSTITUTION LEAVE

        elif category == "INSTITUTION LEAVE":

            leave_to = extra_data.get("to_date")

            if leave_to:

                should_disable = (
                    today > timezone.datetime.strptime(leave_to, "%Y-%m-%d").date()
                )

        # STAFF MEETING

        elif category == "STAFF MEETING":

            meeting_date = extra_data.get("meeting_date")

            if meeting_date:

                should_disable = (
                    today > timezone.datetime.strptime(meeting_date, "%Y-%m-%d").date()
                )

        # MOCK ASSESSMENT

        elif category == "MOCK ASSESSMENT":

            mock_date = extra_data.get("assessment_date")

            if mock_date:

                should_disable = (
                    today > timezone.datetime.strptime(mock_date, "%Y-%m-%d").date()
                )

        # PARTICULAR STAFF LEAVE

        elif category == "PARTICULAR STAFF LEAVE":

            should_disable = today > (item.created_at.date() + timedelta(days=1))

        # FEE REMINDER

        elif category == "FEE REMINDER":

            should_disable = False

        # SCHEDULED INTERVIEW

        elif category == "SCHEDULED INTERVIEW":

            interview_date = extra_data.get("interview_date")

            if interview_date:

                should_disable = (
                    today
                    > timezone.datetime.strptime(interview_date, "%Y-%m-%d").date()
                )

        # OTHER

        elif category == "OTHER":

            should_disable = today > (item.created_at.date() + timedelta(days=2))

        # SOFT DELETE

        if should_disable:

            item.is_active = False
            item.save()