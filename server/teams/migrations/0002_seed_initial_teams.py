from django.db import migrations

TEAM_NAMES = [
    "Team Nova",
    "Team Orbit",
    "Team Pulse",
    "Team Cipher",
    "Team Apex",
]


def seed_teams(apps, schema_editor):
    Team = apps.get_model("teams", "Team")

    for name in TEAM_NAMES:
        Team.objects.get_or_create(
            name=name,
            defaults={
                "project_name": "",
                "score": 0,
            },
        )


def unseed_teams(apps, schema_editor):
    Team = apps.get_model("teams", "Team")
    Team.objects.filter(name__in=TEAM_NAMES).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("teams", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_teams, unseed_teams),
    ]
