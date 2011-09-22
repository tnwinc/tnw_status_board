require "cinch"
require "pusher"

Pusher.app_id = ''
Pusher.key = ''
Pusher.secret = ''

def send(m, message, opts=nil)
    begin
        Pusher['test_channel'].trigger(message, opts)
        yield
    rescue Pusher::Error => err
        m.reply "ERROR: #{err}"
    end
end

module KnowsAdmins
    Admins = ["brendanjerwin","Contejious", "cubanx"]

    def is_admin?(user)
        user.refresh # be sure to refresh the data, or someone could steal
                     # the nick
        Admins.include?(user.authname)
    end
end

class Autovoice
  include Cinch::Plugin
  include KnowsAdmins

  listen_to :join
  match /autovoice (on|off)$/

  def listen(m)
    unless m.user.nick == bot.nick
      m.channel.voice(m.user) if @autovoice
    end
  end

  def execute(m, option)
    return unless is_admin?(m.user)

    @autovoice = option == "on"

    m.reply "Autovoice is now #{@autovoice ? 'enabled' : 'disabled'}"
  end
end

class StatusBoard
    include Cinch::Plugin

    match /reload board/, :method => :reload
    match /callout (.*)/, :method => :callout
    match /standup/, :method => :standup
    match /set (\w+) to (.*)/, :method => :set_url
    match /[tnw_status_board] (\w+) pushed .* commit to gh-pages/, :method => :board_changed
    match /youtube (.*)/ ,:method => :youtube
    match /sound (.*)/, :method => :sound

    def board_changed(m, who)
        m.reply "#{who} seems to have changed the board, I think its time to reload."
        reload m
    end

    def set_url(m, pane, url)
        send m, 'set_url', {:pane => pane, :url => url} do
            m.reply "URL Set"
        end
    end

    def standup(m)
        send m, 'start_standup', 16 do
            m.reply "ALL RISE!"
        end
    end

    def reload(m)
        send m, 'reload_board' do
            m.reply "Reload command sent."
        end
    end

    def youtube(m, id)
        send m, 'set_callout', type: :youtube, content: id do

        end
    end

    def sound(m, url)
        send m, 'play_sound', url do

        end
    end

    def callout(m, content)
        #data {timeout, type, content}
        #types [image, url, text]

        type = :text
        timeout = 20
        if content =~ /^http(|s):\/\/.*/
            type = :url
            timeout = 120
            if content =~ /\.(png|gif|jpg|jpeg)$/
                type = :image
                timeout = 30
            else
                m.channel.topic = "#{m.user.nick} thinks you should see: #{content}"
            end
        end

        if type == :text
            content = "&#8220;#{content}&#8221; -- #{m.user.nick}"
        end

        send m, 'set_callout', timeout: timeout, type: type, content: content do
            m.reply "I set the callout for you."
        end
    end
end

class Sentry
  include Cinch::Plugin
  include KnowsAdmins

  listen_to :join

  def listen(m)
    unless m.user.nick == bot.nick
        m.channel.op(m.user) if is_admin?(m.user)
    end
  end

end

bot = Cinch::Bot.new do
  configure do |c|
    c.nick = "tnw_red_bot"
    c.server = 'irc.freenode.net'
    c.channels = ["#tnw_red_team"]
    c.plugins.plugins = [Sentry, Autovoice, StatusBoard]
  end
end

bot.start
